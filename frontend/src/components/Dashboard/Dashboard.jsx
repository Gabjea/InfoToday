import React from 'react';
import Sessions from './Sessions/Sessions';
import SolvedPbs from './SolvedPbs/SolvedPbs';
import Topbar from './Topbar/Topbar';

export default function Dashboard(props) {

    return (
        <div style={{ 'overflow': 'hidden' }} className='text-lg'>
            <Topbar />

            <div class="w-full overflow-x-hidden border-t flex flex-col">
                <main class="w-full flex-grow p-6">
                    <h1 class="text-3xl text-black pb-6">Dashboard</h1>

                    <Sessions />

                    {/**solved pbs */}
                    <SolvedPbs />
                </main>

            </div>
        </div>
    );
}