import React from 'react';
import { formatDate } from '../../utils/DateTime';
import { axiosAuthInstanceToAPI } from '../../utils/serverAPI';

function CreateSession(props) {
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

    const handleSubmit = event => {
        event.preventDefault();
        const { value: startDateStr } = startDateRef.current;
        const { value: endDateStr } = endDateRef.current;
        const { value: studentId } = studentRef.current;
        const { value: cost } = costRef.current;

        //console.log(Math.abs((new Date(endDate)).getHours() - (new Date(startDate)).getHours() ) );
        const startDate = formatDate(startDateStr);
        const endDate = formatDate(endDateStr);

        axiosAuthInstanceToAPI.post('/teacher/session/create', {
            startDate, endDate, studentId, cost
        }).then(res => {
            console.log(res.data);

        }, err => {
            console.error(err);
            alert('ERROR!');
        })//*/p


    //console.log(startDate.toString(), endDate, studentId, cost);
}

return (
    <div>
        <form onSubmit={handleSubmit}>
            <input ref={startDateRef} className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500' type="datetime-local" />
            <input ref={endDateRef} className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500' type="datetime-local" />
            <select name="students" id="students" ref={studentRef}>
                {
                    students.map(student => <option key={student.id} value={student.id}>{student.name}</option>)
                }
            </select>
            <br />
            <input ref={costRef} type="number" placeholder='cost' className='border border-gray-700' /><br />
            <input type="submit" />
        </form>
    </div>
);
}

export default CreateSession;