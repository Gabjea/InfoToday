import React from 'react';
import { formatDate } from '../../utils/DateTime';
import { axiosAuthInstanceToAPI, getUserDataFromJwtReq } from '../../utils/serverAPI';

function CreateSession(props) {

    React.useEffect(() => {
        getUserDataFromJwtReq().then(({ role }) => {
            console.log(role);
            if (role === 'student') {
                window.location.assign('/');
            }
        })
    }, [])

    const [students, setStudents] = React.useState([]);

    React.useEffect(() => {
        axiosAuthInstanceToAPI.get('teacher/students').then(res => {
            setStudents(res.data);
        }, err => {
            console.error(err);
        })
    }, [])

    const startDateRef = React.createRef();
    const endDateRef = React.createRef();
    const studentRef = React.createRef();
    const costRef = React.createRef();

    const handleClick = event => {
        event.preventDefault();
        const { value: startDateStr } = startDateRef.current;
        const { value: endDateStr } = endDateRef.current;
        const { value: studentId } = studentRef.current;
        const { value: cost } = costRef.current;

        //console.log(Math.abs((new Date(endDate)).getHours() - (new Date(startDate)).getHours() ) );
        const startDate = formatDate(startDateStr);
        const endDate = formatDate(endDateStr);


        if (startDate === 'Invalid Date' || endDate === 'Invalid Date' || cost <= 0) {
            alert('Date invalida!')
            return;
        }

        axiosAuthInstanceToAPI.post('/teacher/session/create', {
            startDate, endDate, studentId, cost
        }).then(res => {
            alert(res.data);
            window.location.assign('/dashboard');
        }, err => {
            console.error(err);
            alert('ERROR!');
        })//*/p


        //console.log(startDate.toString(), endDate, studentId, cost);
    }

    return (
        <div className='h-screen flex items-center justify-center'>
            <form className='w-1/2' onSubmit={null}>
                <p className='text-2xl'>Start Date:</p>
                <input ref={startDateRef} className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 mb-2' type="datetime-local" />
                <p className='text-2xl'>End Date:</p>
                <input ref={endDateRef} className=' bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 mb-5' type="datetime-local" />
                <p className='text-2xl'>Student:</p>
                <select className='w-full mb-5 block bg-white text-gray-700 border border-gray-400 shadow-inner rounded-md py-2 px-4 leading-tight focus:outline-none  focus:border-gray-500' name="students" id="students" ref={studentRef}>
                    {
                        students.map(student => <option key={student.id} value={student.id}>{student.name}</option>)
                    }
                </select>

                <p className='text-2xl'>Cost:</p>
                <input
                    ref={costRef}
                    type="number"
                    placeholder='lei'
                    className='w-full border border-gray-700 appearance-none block bg-white text-gray-700 border border-gray-400 shadow-inner rounded-md py-3 px-4 leading-tight focus:outline-none  focus:border-gray-500 mb-10' /><br />
                <button onClick={handleClick}
                    className='text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-md px-5 py-2.5 text-center  w-full' >
                    creaza
                </button>
            </form>
        </div>
    );
}

export default CreateSession;