import { createContext, useContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import db from "../firebase";

const UserContext = createContext();
const ledgerCollection = db.collection("ledger");
const savingsCollection = db.collection("savings");
const accTypeCollection = db.collection("accountType");

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState({});
    const [refresh, setRefresh] = useState(new Date());

    //create user on firebase
    const createUser = async (email, password) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        db.collection("users").doc(userCredential.user.uid).set({
            email: userCredential.user.email,
            uid: userCredential.user.uid,
        });
    }

    //sign in user on firebase
    const signIn = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    }

    const signInWithGoogle = async () => {
        const userCredential = await signInWithPopup(auth, provider);
        db.collection("users").doc(userCredential.user.uid).set({   //CHECK
            email: userCredential.user.email,
            uid: userCredential.user.uid,
        });
    }

    //logout user from firebase
    const logout = () => {
        return signOut(auth);
    }

    //add income/expense data to firestore
    const addIncomeOrExpense = (formData, entryType) => {
        const data = { ...formData, uid: user.uid, entryType : entryType} //income is a credit type ("C")
        ledgerCollection.add(data);
        // console.log("income/expense data added to firestore");
        setRefresh(new Date());
    }

    //add savings to firestore
    const addSavings = (formData) => {
        const data = { ...formData, uid: user.uid}
        savingsCollection.add(data);

        // console.log("savings data added to firestore");
        setRefresh(new Date());
    }

    //edit income/expense data from firestore
    const editData = (budgetType, docId, formData) => {        

        if (budgetType === "income" || budgetType === "expense"){
            ledgerCollection.doc(docId).update(formData);
        }
        else if (budgetType === "savings"){
            savingsCollection.doc(docId).update(formData);
        }
        // console.log("income/expense/savings data added to firestore");
        setRefresh(new Date());
    }

    //delete income/expense data from firestore
    const deleteData = (budgetType, docId) => {
        if (budgetType === "income" || budgetType === "expense"){
            ledgerCollection.doc(docId).delete();
        }
        else if (budgetType === "savings"){
            savingsCollection.doc(docId).delete();
        }

        // console.log("income/expense/savings deleted from firestore");
        setRefresh(new Date());
    }

    //fetch data from firestore
    const fetchData = async (budgetType, entryType) => {
        let data = [];
        // console.log("length: ", data.length);
        let snapshot = "";
        try {
                
            if (budgetType === "income" || budgetType === "expense"){
                snapshot = await ledgerCollection.where('uid', '==', user.uid).where('entryType', '==', entryType).get();
            }
            else if (budgetType === "savings"){
                snapshot = await savingsCollection.where('uid', '==', user.uid).get();
            }
            // console.log("snapshot: ", snapshot);
            snapshot.forEach(doc => {
                    data.push({ ...doc.data(), id : doc.id });
            });
        }
        catch (e) {
            console.log("error: ", e);
            // message.error()
        }

        // console.log("current data: ", data);

        return data;
    }

    const fetchTotalAmounts = async () => {
        let totalUserCredit = 0;
        let totalUserDebit = 0;
        let snapshot = "";

        try {
            snapshot = await ledgerCollection.where('uid', '==', user.uid).get();

            snapshot.forEach(doc => {
                if (doc.data().entryType === 'C') {
                    totalUserCredit = totalUserCredit + doc.data().amount
                }
                else if (doc.data().entryType === 'D') {
                    totalUserDebit = totalUserDebit + doc.data().amount
                }
            })
        }
        catch (e) {
            console.log("error: ", e);
            // message.error()
        }

        return [totalUserCredit, totalUserDebit];
    }

    // //fetch possible account types from firestore
    const fetchAccountTypes = async (budgetType) => {
        let data = [];

        let snapshot = "";
        try {
                
                snapshot = await accTypeCollection.where('type', 'in', [budgetType, 'both']).get();
                // console.log("snapshot: ", snapshot);
                snapshot.forEach(doc => {
                    data.push({ ...doc.data(), id : doc.id });
                });
        }
        catch (e) {
            console.log("error: ", e);
            // message.error()
        }

        return data;
    }

    useEffect(() => {
        //check to see if user is signed in
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            // console.log("the current user is: ", currentUser);
            setUser(currentUser);

        return () => unsubscribe();
        }, [])
    })

    return (
        <UserContext.Provider value={ {createUser, user, logout, signIn,
         signInWithGoogle, addIncomeOrExpense, fetchData, deleteData, 
         editData, addSavings, refresh, fetchTotalAmounts, fetchAccountTypes } }>
            {children}
        </UserContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(UserContext);
}