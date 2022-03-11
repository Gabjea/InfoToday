import React from 'react';
import { axiosAuthInstanceToAPI } from "./../../../../utils/serverAPI";
import Accept from './Accept';

export default function Accepts(props) {
    const [acceptedStudents, setAcceptedStudents] = React.useState([]);

    React.useEffect(() => {
        
        axiosAuthInstanceToAPI.get('/teacher/students').then(res => {
            //console.log(res.data);
            setAcceptedStudents(res.data);
        }, err => {
            //alert('ERROR!');
        })//*/
    }, [])

    return (
        <div>
            {
                acceptedStudents.map(acceptedStudent => <Accept
                    key={acceptedStudent.id} id={acceptedStudent.id}
                    name={acceptedStudent.name} pic={acceptedStudent.pic}
                />)
            }
        </div>
    );
}