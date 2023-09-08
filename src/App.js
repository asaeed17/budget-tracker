import './App.css';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from './Components/Login';
import SignUp from './Components/SignUp';
import Root from './Components/Root';
import Dashboard from './Components/Dashboard';
import { AuthContextProvider } from './Context/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';
import Home from './Components/Dashboard/Home';
import Income from './Components/Dashboard/Income';
import Expense from './Components/Dashboard/Expense';
import Savings from './Components/Dashboard/Savings';
import BudgetVisualisation from './Components/Dashboard/BudgetVisualisation';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    // errorElement: ,
    // loader: ,
    // action: ,
  },
  {
    path: "login",
    element: <Login />
  },
  {
    path: "signup",
    element: <SignUp />
  },
  {
    path: "dashboard",
    element: <ProtectedRoute> 
              <Dashboard />
             </ProtectedRoute>,
    children: [
      {
        path: "home",
        element: <Home />
      },
      {
        path: "income",
        element: <Income />
      },
      {
        path: "expense",
        element: <Expense />
      },
      {
        path: "savings",
        element: <Savings />
      },
      {
        path: "budget-visualisation",
        element: <BudgetVisualisation />
      },
    ]
  }
]);

function App() {
  return (
    <div className="App">
      <AuthContextProvider>
      <RouterProvider router={router} />
      </AuthContextProvider>
    </div>
  );
}

export default App;
