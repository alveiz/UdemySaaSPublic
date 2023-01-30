import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const authToken = localStorage.getItem('authToken');
    return authToken ? children : <Navigate to="/login" />;
}

export default PrivateRoute;