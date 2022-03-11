import React from 'react';
import Pendings from './Pendings/Pendings';
import Accepts from './Accepts/Accepts';

export default function AppliesTeacher(props) {
    
    return (
        <div>
            <h2 style={{'fontSize': '22px'}} className='flex items-center flex-col'>Pending:</h2>
            <Pendings />
            <br />
            <hr />
            <br />
            <h2 style={{'fontSize': '22px'}} className='flex items-center flex-col'>Accepted:</h2>
            <Accepts />
        </div>
    );
}