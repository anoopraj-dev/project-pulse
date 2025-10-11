import Home from "../pages/Home";
import SignIn from "../pages/SignIn";
import Signup from "../pages/Signup";
import VerifyEmail from "../pages/VerifyEmail";
import NotFound from "../pages/NotFound";
import AdminLogin from "../pages/admin/AdminLogin";
import ResetPassword from "../pages/ResetPassword";

const CommonRoutes = [
  { path: "/", element: <Home /> },
  { path: "/signin", element: <SignIn /> },
  { path: "/signup", element: <Signup /> },
  { path: "/verify-email", element: <VerifyEmail /> },
  { path: "/admin/login", element: <AdminLogin /> },
  { path: "/page-not-found", element: <NotFound /> },
  {path: '/reset-password', element:<ResetPassword/>},
];

export default CommonRoutes;

