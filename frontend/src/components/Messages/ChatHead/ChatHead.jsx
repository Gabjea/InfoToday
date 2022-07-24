import React from 'react';

function ChatHead({ id, name, pic, handleClick }) {
    return (
        <div id={id} onClick={handleClick}>
            <button id={id}
                className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2"
            >
                <div id={id}
                    className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full"
                >
                    <img src={pic} id={id} alt={name[0]} className='rounded-full w-full h-full' />
                </div>
                <div id={id} className="ml-2 text-sm font-semibold">{name}</div>
            </button>
        </div>
    );
}

export default ChatHead;