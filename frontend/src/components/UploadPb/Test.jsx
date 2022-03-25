import React from 'react';

function Test({ id, refToInput, refToOutput }) {
    return (
        <div className= 'mt-2 mb-2' >
            <p className='text-2xl'>Test #{id + 1}</p>
            <div className="flex mt-4">
         
            
            <input
              className="appearance-none mr-2 block w-full bg-white text-gray-700 border border-gray-400 shadow-inner rounded-md py-3 px-4 leading-tight focus:outline-none  focus:border-gray-500"
              ref={refToInput}
              type="text"
              id={`input${id}`}
           
              placeholder="Input"
            />
        
         
            <input
              className="appearance-none block w-full bg-white text-gray-700 border border-gray-400 shadow-inner rounded-md py-3 px-4 leading-tight focus:outline-none  focus:border-gray-500"
              ref={refToOutput}
              type="text"
              id={`input${id}`}
             
              placeholder="Output"
            />
          
        </div>
     </div>
    );
}

export default Test;