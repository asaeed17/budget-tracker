import { Navigate } from "react-router";
import { UserAuth } from "../Context/AuthContext";

const Root = () => {
   const { user } = UserAuth();
   
   if (!user) {
    return <Navigate to="/login" />
   }
    return <Navigate to="/dashboard/home" />
   
}

export default Root;