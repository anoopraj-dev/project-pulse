import {Route} from  'react-router-dom'
import AdminLogin from '../pages/admin/AdminLogin'
import Dashboard from '../pages/admin/Dashboard'
import ProtectedRoute from '../components/ProtectedRoute'

const adminRoutes = [
    <Route path='/admin/login' element={<AdminLogin/>}/>,
    <Route path='/admin/login' element= {<ProtectedRoute role='admin'><Dashboard/></ProtectedRoute>} />
]

export default adminRoutes;