import React from "react"
import { axiosAuthInstanceToAPI } from "../../utils/serverAPI";
import AplliesStudent from "./AplliesStudent/AplliesStudent";
import AppliesTeacher from "./AplliesTeacher/AppliesTeacher";

export default function Applies() {
    const [role, setRole] = React.useState(''); 

    React.useEffect(() => {
        axiosAuthInstanceToAPI.get('/user/role').then(res => {
            //console.log(res.data);
            setRole(res.data);
        })
    }, [])

    if (role === 'student') {
        return <AplliesStudent />;
    }
    if (role === 'teacher') {
        return <AppliesTeacher />;
    }
    return null;
}