import Home from "../pages/Home";
import SignIn from "../pages/SignIn";
import Signup from "../pages/Signup";
import VerifyEmail from "../pages/VerifyEmail";
import NotFound from "../pages/NotFound";
import AdminLogin from "../pages/admin/AdminLogin";
import PublicRoute from "../components/PublicRoute";


const CommonRoutes = [
  { path: "/", element: <PublicRoute><Home /></PublicRoute> },
  { path: "/signup", element: <PublicRoute><Signup /></PublicRoute> },
  { path: "/verify-email", element:<PublicRoute><VerifyEmail /> </PublicRoute> },
  {path:'/signin',element: <PublicRoute><SignIn></SignIn></PublicRoute>},
  { path: "/admin/login", element: <AdminLogin /> },
  { path: "/page-not-found", element: <NotFound /> },
  {path: '/reset-password', element:<VerifyEmail />},
  
];

export default CommonRoutes;

