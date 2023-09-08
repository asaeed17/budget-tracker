import { Button, Modal, Form, Input, Select } from "antd";
import { useState, useEffect } from "react";
import { UserAuth } from "../../Context/AuthContext";
import IncExpTable from "./IncomeExpenseTable";

const Expense = () => {
    
    const [form] = Form.useForm();
    const [isAddingExpense, setIsAddingExpense] = useState(false);
    const [expenseTypes, setExpenseTypes] = useState([]);
    
    const { addIncomeOrExpense, fetchAccountTypes } = UserAuth();

    useEffect(() => {
            
        fetchAccountTypes("expense").then(expenseTypes => {
            setExpenseTypes(expenseTypes);
        })
        
    }, [fetchAccountTypes])

    const OnClickAddExpense = () => {
        // console.log("Add expense clicked");
        setIsAddingExpense(true);
    }

    const resetAddExpense = () => {
        // console.log("Add expense finished");
        setIsAddingExpense(false);
    }
    
    const handleAddExpense = (expenseValues) => {
        // console.log("Expense added to firebase: ", expenseValues);
        // console.log("account type: ", accountType)
        if (!expenseValues.transactionDescription) {
            expenseValues.transactionDescription = " ";
        }
        expenseValues.amount = Number(expenseValues.amount);

        addIncomeOrExpense(expenseValues, 'D');
    }
    
    return (
        <div>
            <div className="add-delete-button">
            <Button style={{fontWeight : 700, blockSize : 45}} onClick={OnClickAddExpense}>Add Expense</Button> 
            </div>
            <Modal
                title="Add Expense"
                okText="Save"
                open={isAddingExpense}
                onCancel={resetAddExpense}
                onOk={() => {
                    form
                        .validateFields()
                        .then((values) => {
                            form.resetFields();
                            handleAddExpense(values);
                            resetAddExpense();
                        })
                        .catch((error) => {
                            console.log("add income error: ", error);
                        })
                }}
            >
                <Form
                    form={form}
                    name="add-expense"
                    autoComplete="off"
                    onFinish={handleAddExpense}
                >
                
                    <Form.Item
                    label=""
                    name="accountType"
                    rules={[
                        {
                        required: true,
                        message: 'Please choose the account type!',
                        },
                    ]}
                    // required
                    >
                        <Select
                                placeholder="Account Type" 
                                style={{
                                    width: '100%',
                                  }}
                                options={expenseTypes}
                            >
                                
                            </Select>
                    </Form.Item>

                    <Form.Item
                    label="Title"
                    name="title"
                    style={{ marginLeft: 108 }}
                    rules={[
                        {
                        required: true,
                        message: 'Please input your transaction title!',
                        },
                    ]}
                    >
                    <Input 
                        type="text"
                        style={{ width: 315 }}
                        />
                    </Form.Item>

                    <Form.Item
                    label="Amount"
                    name="amount"
                    style={{ marginLeft: 83 }}
                    rules={[
                        {
                        required: true,
                        message: 'Please input your amount!',
                        },
                    ]}
                    >
                        <Input 
                        type="number" 
                        min="0" 
                        placeholder='1000' 
                        style={{ width: 315 }}
                        />    
                    </Form.Item>

                    <Form.Item
                    label="Transaction Description"
                    name="transactionDescription"
                    rules={[
                        {
                        },
                    ]}
                    >
                    <Input 
                        type="text"
                        style={{ width: 315}}
                        />
                    </Form.Item>

                    <Form.Item
                    label="Transaction Date"
                    name="transactionDate"
                    style={{ marginLeft: 30 }}
                    rules={[
                        {
                        required: true,
                        message: 'Please input your transaction date!',
                        },
                    ]}
                    >
                        <Input 
                        type="date" 
                        style={{ width: 315 }}
                        />    
                    </Form.Item>
        
                </Form>

            </Modal>

            <div style={{marginTop : 20}}>
            <IncExpTable budgetType="expense" />
            </div>

        </div>
        
    );
}

export default Expense;