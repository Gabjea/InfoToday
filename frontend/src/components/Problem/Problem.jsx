import React from 'react';
import { useParams } from "react-router-dom";

function Problem(props) {
    const { name } = useParams();

    React.useEffect(() => {
        
    }, [])

    return (
        <div>
            {name}
        </div>
    );
}

export default Problem;