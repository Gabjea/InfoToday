import React from 'react';

function Session({ session, socket }) {
    const handleClick = event => {
        event.preventDefault();
        const id = session.session._id;
        window.location.assign(`/session/${id}`);
    }

    return (
        <div
            className='w-full  rounded overflow-hidden h-auto border border-gray-300 shadow shadow-lg'
            key={session._id}>
            <p>cu: <i>{'  '}{session.name}</i></p>
            <div>inteval: {'  '}
                {session.session.startDate} <span className='text-3xl'>&#8594;</span> {session.session.endDate}
            </div>
            <div className='flex justify-end'>
                <button type="button" onClick={handleClick} className=" text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Join</button>
            </div>
        </div>
    );
}

export default Session;