import React from 'react';
import { Link } from "react-router-dom"

function ProblemBox({ name, text, isSession }) {
    return (
        <div>
            {!isSession && <Link to={`/problem/${name}`}>{name}</Link>}
            {isSession && <div>{name}, {text}</div> }
        </div>
    );
}

export default ProblemBox;