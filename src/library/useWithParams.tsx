
import {useParams} from 'react-router-dom';

export default (Component: any) => {
    return (props: any) => {
        const params = useParams();
        return <Component {...params} {...props} />;
    };
};