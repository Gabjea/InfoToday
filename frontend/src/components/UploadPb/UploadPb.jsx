import React from 'react';
import { CATEGORIES } from '../../utils/constants';
import { axiosAuthInstanceToAPI } from '../../utils/serverAPI';
import useArrayRef from '../../utils/UseArrayRef';
import Test from './Test';
const MIN_TESTS = 5, MAX_TESTS = 20;

export default function UploadPb(props) {
    let id = 0;
    const nameRef = React.createRef();
    const statementRef = React.createRef();
    const categorySelRef = React.createRef();
    const [nrTests, setNrTests] = React.useState(5);
    const [elementsInp, refInp] = useArrayRef();
    const [elementsOut, refOut] = useArrayRef();

    const handleSubmit = event => {
        event.preventDefault();
        const { value: name } = nameRef.current;
        const { value: category } = categorySelRef.current;
        const { value: text } = statementRef.current;
        const tests = []; //tests[i] = {input: '', output: ''}
        for (let i = 0; i < nrTests; i++) {
            tests.push({
                input: elementsInp[i].value,
                output: elementsOut[i].value
            });
        }

        axiosAuthInstanceToAPI.post('/teacher/problem/add', {
            name, category, text, tests
        }).then(res => {
            alert(res.data);
            window.location.assign('/');
        }, err => {
            alert('ERROR!');
        })
    }

    return (
        <div className='min-h-screen flex items-center justify-center'>
            
            <form className='w-1/2' onSubmit={handleSubmit}>
            <div className="w-full md:w-full mb-2">
          <label className="text-2xl">
            Nume:
          </label>
          <input
            className="appearance-none block w-full bg-white text-gray-700 border border-gray-400 shadow-inner rounded-md py-3 px-4 leading-tight focus:outline-none  focus:border-gray-500"
            ref={nameRef}
            type="text"
            name="name"
            placeholder="Nume"
          />
        </div>
               
                <label className='text-2xl' for="category">Alege o categorie:</label> <br />
                <select className='w-full mb-5 block bg-white text-gray-700 border border-gray-400 shadow-inner rounded-md py-2 px-4 leading-tight focus:outline-none  focus:border-gray-500' id="category" name="categories" ref={categorySelRef}>
                    {
                        CATEGORIES.map(key => <option value={key}>{key}</option>)
                    }
                </select>
               
                <p className='text-2xl'>Enunt:</p>
                <textarea required className='bg-gray-100 px-4 rounded-md border leading-normal w-full h-40  shadow-inner border border-gray-400 font-medium placeholder-gray-700 focus:outline-none focus:bg-white' type="text" ref={statementRef} />
                
                <br />
                <p className='text-2xl'>Numar teste:</p>
                <input type="number"
                    placeholder={`${MIN_TESTS}-${MAX_TESTS}`}
                    onChange={event => setNrTests(() => {
                        let value = Number(event.target.value);
                        value = Math.max(value, MIN_TESTS);
                        value = Math.min(value, MAX_TESTS);
                        return (value);
                    })}
                    className='w-full  border border-gray-700 appearance-none block bg-white text-gray-700 border border-gray-400 shadow-inner rounded-md py-3 px-4 leading-tight focus:outline-none  focus:border-gray-500' />
                {
                    [...Array(nrTests)].map(() => {
                        return <div> <Test key={Math.random()} id={id++} refToInput={refInp} refToOutput={refOut} /> </div>
                    })
                }
                <br />
               
                <input className='mb-10 text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-md px-5 py-2.5 text-center  w-full' type="submit" />
            </form>
        </div>
    );
}