import { Navigate } from "react-router";
import { UserAuth } from "../Context/AuthContext";

const ProtectedRoute = ({children}) => {
    // const navigate = useNavigate();
    const {user} = UserAuth(); //fetch current user from context

    if (!user) {
        return <Navigate to="/login" /> //or "/" ??
        // navigate("/login"); 
    }

    return children; // dashboard?

}

export default ProtectedRoute;