import { Navigate } from 'react-router-dom';

const NormalWrapper = ({ children }) => {
    const sub = localStorage.getItem('sub');
    
    return sub === "normal" ? children : <Navigate to="/" />;
}

export default NormalWrapper;