import React from 'react';
import { CATEGORIES } from '../../utils/constants';
import { axiosAuthInstanceToAPI } from '../../utils/serverAPI';
import useArrayRef from '../../utils/UseArrayRef';
import Messages from '../Messages/Messages';
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
        <div>
            <br />
            <form onSubmit={handleSubmit}>
                <input placeholder={`input`} className='border border-gray-500' type="text" ref={nameRef} />
                <br />
                <label for="category">Choose category:</label> <br />
                <select id="category" name="categories" ref={categorySelRef}>
                    {
                        CATEGORIES.map(key => <option value={key}>{key}</option>)
                    }
                </select>
                <br /><br />
                <textarea required className='border border-gray-500' type="text" ref={statementRef} />
                <br />
                <input type="number"
                    placeholder={`${MIN_TESTS}-${MAX_TESTS}`}
                    onChange={event => setNrTests(() => {
                        let value = Number(event.target.value);
                        value = Math.max(value, MIN_TESTS);
                        value = Math.min(value, MAX_TESTS);
                        return (value);
                    })}
                    className='border border-gray-500' />
                {
                    [...Array(nrTests)].map(() => {
                        return <div> <Test id={id++} refToInput={refInp} refToOutput={refOut} /> </div>
                    })
                }
                <br />
                <input type="submit" />
            </form>
        </div>
    );
}