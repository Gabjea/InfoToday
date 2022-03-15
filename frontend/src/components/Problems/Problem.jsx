import React from 'react';
import CodingGround from '../CodingGround/CodingGround';

function Problem({ problem, socket }) {
    React.useEffect(() => {

    }, [])

    return (
        <div className='flex'>
                <div className=''>
                <p className='text-3xl'>{problem.name}</p>
                <i>{'nume creator'}</i>
                <hr />
                {problem.text}
                <hr />
                <p>Exemplu:</p>
                Input:
                <br />
                <textarea readOnly defaultValue={problem.tests[0].input} className='border border-gray-600' name="input" cols="30" rows="10">
                </textarea>
                <br />
                Output:
                <br />
                <textarea readOnly defaultValue={problem.tests[0].output} className='border border-gray-600' name="output" cols="30" rows="10">
                </textarea>
                <br /><br /><br />
            </div>
            <div className=''>

                <CodingGround pbName={problem.name} socket={socket} />
            </div>

        </div>
    );
}

export default Problem;