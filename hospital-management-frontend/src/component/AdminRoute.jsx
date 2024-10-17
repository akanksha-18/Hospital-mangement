/* eslint-disable react/prop-types */
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

    
    if (!token || userRole !== 'super_admin') {
        return <Navigate to="/" />; 
    }

    return children; 
};

export default AdminRoute;
