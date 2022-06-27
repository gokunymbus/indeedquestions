import {useNavigate } from 'react-router-dom';

export default (Component: any) => {
    return (props: any) => {
        const navigate = useNavigate();
        return <Component navigate={navigate} {...props} />;
    };
};