import React from 'react';
import { axiosAuthInstanceToAPI } from '../../utils/serverAPI';
import Teacher from './Teacher';

export default function Teachers(props) {
    const [teachers, setTeachers] = React.useState([]);

    React.useEffect(() => {
        axiosAuthInstanceToAPI.get('/teacher/all').then(res => {
            //console.log(res.data);
            setTeachers(res.data);
        })
    }, [])

    return (
        <div id='teachers' className="flex h-screen justify-center items-center flex-col" >
            {
                teachers.map(teacher => <Teacher key={teacher.id} id={teacher.id} name={teacher.name} desc={teacher.desc} pic={teacher.pic} />)
            }
        </div>
    );
}