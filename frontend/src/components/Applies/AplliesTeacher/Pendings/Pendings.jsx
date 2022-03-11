import React from 'react';
import { axiosAuthInstanceToAPI } from "./../../../../utils/serverAPI";
import Pendig from './Pendig';

export default function Pendings(props) {
    const [pendingStudents, setPendingStudents] = React.useState([]);

    React.useEffect(() => {
        axiosAuthInstanceToAPI.get('/teacher/apply/all').then(res => {
            //console.log(res.data);
            setPendingStudents(res.data);
        }, err => {
            alert('ERROR!');
        })//*/
    }, [])

    return (
        <div>
            {
                pendingStudents.map(pendingStudent => <Pendig
                    key={pendingStudent.id} id={pendingStudent.id}
                    name={pendingStudent.name} pic={pendingStudent.pic}
                />)
            }
        </div>
    );
}