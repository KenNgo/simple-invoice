import { FC } from 'react';
import { Navigate } from 'react-router-dom';

interface PropType {
    component: React.FC;
}

const PrivateRoute: FC<PropType> = ({ component: Component }) => {
    const auth = sessionStorage.getItem('isAuthenticated');
    if (auth === "false") {
        return <Navigate to='/' />;
    }
    return <Component />;
};

export default PrivateRoute;