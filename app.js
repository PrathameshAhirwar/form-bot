import ReactDOM from 'react-dom/client'
import App from './src/App'
import LandingPage from './src/components/LandingPage/LandingPage';
import LoginPage from './src/components/LoginPage/LoginPage';
import { createBrowserRouter, RouterProvider } from 'react-router'
import Signup from './src/components/Signup/Signup';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './src/components/Dashboard/Dashboard';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Flow from './src/components/FormFlow/Flow';




const root = ReactDOM.createRoot(document.getElementById("root"))

const appRouter = createBrowserRouter([
    {
        path:"/",
        element:<App/>,
        children:[
            {
                path:"/",
                element:<LandingPage />
            },
            {
                path:"/login",
                element:<LoginPage />
            },
            {
                path:"/signup",
                element:<Signup />
            },
            {
                path:"/dashboard/:userId",
                element:<Dashboard />
            },
            {
                path: "/dashboard/:userId/form/:formId/flow", // Add this new route
                element: <Flow />
            }
        ]
    },
])

root.render(
    <RouterProvider router={appRouter} />
)
