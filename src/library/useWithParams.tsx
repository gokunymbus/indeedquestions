
import {useParams} from 'react-router-dom';

/**
 * Simple HOC for adding the useParams
 * to any component
 */
export default (Component: any) => {
    return (props: any) => {
        const params = useParams();
        return <Component {...params} {...props} />;
    };
};