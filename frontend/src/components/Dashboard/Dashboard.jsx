import React from 'react';
import Sessions from './Sessions/Sessions';
import SolvedPbs from './SolvedPbs/SolvedPbs';
import Topbar from './Topbar/Topbar';

export default function Dashboard() {

    return (
        <div style={{ 'overflow': 'hidden' }} className='text-lg'>
            <Topbar />
            <div className='flex'>
                <Sessions />
                <SolvedPbs />
            </div>
        </div>
    );
}