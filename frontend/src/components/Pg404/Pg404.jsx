import React from 'react';
import {
    useLocation
} from "react-router-dom";

export default function Pg404() {
    const location = useLocation();

    return (
        <div>
            <h2 style={{ 'color': 'red' }}>Error 404!</h2>
            <h5>No match for {location.pathname}</h5>
        </div>
    );
}