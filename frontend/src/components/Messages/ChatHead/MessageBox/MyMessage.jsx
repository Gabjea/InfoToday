import React from 'react';

function MyMessage({ message, pic }) {
    return (
        <div className="col-start-6 col-end-13 p-3 rounded-lg">
            <div className="flex items-center justify-start flex-row-reverse">
                <div
                    className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0"
                >
                    <img src={pic} className='rounded-full w-20 h-10' alt="" />
                </div>
                <div
                    className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl"
                >
                    <div>{message}</div>
                </div>
            </div>
        </div>
    );
}

export default MyMessage;