import React from 'react';

function Test({ id, refToInput, refToOutput }) {
    return (
        <div >
            <p>Test #{id + 1}</p>
            <input required placeholder={`input`} className='border border-gray-500' type="text" id={`input${id}`} ref={refToInput} />
            <input required placeholder={`output`} className='border border-gray-500' type="text" id={`output${id}`} ref={refToOutput} />
        </div>
    );
}

export default Test;