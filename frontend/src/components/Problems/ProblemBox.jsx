import React from 'react';

export default function ProblemBox({ problem, setDisplayed }) {
    const handleClick = event => {
        event.preventDefault();
        setDisplayed(problem.name);
    }

    return (
        <div className='border border-gray-600'>
            <button onClick={handleClick}><b style={{'color': 'blue', 'textDecoration': 'underline'}} className='text-xl'>
                {problem.name}
            </b></button>
            <hr />
            <p className='text-sm'>{problem.text}</p>
        </div>
    );
}