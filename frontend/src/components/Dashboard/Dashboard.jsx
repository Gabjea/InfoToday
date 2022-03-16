import React from 'react';
import Sessions from './Sessions/Sessions';
import SolvedPbs from './SolvedPbs/SolvedPbs';

export default function Dashboard(props) {

    
    return (
        <div style={{ 'overflow': 'hidden' }} className='text-lg flex lg:flex-row'>
            <Sessions />
            <SolvedPbs />
        </div>
    );
}