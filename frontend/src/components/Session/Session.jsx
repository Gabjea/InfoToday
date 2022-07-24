import React from "react"
import { useParams } from "react-router-dom";
import CookieManager from '../../utils/CookieManager';
import { baseWsURL, getUserDataFromJwtReq } from './../../utils/serverAPI';
import io from 'socket.io-client';
import Problems from '../Problems/Problems';
import './Session.css'
import Members from "./Members";
const socket = io(baseWsURL);

export default function Session() {
    const { id: sessionId } = useParams();

    const [members, setMembers] = React.useState([]);
    const [selfData, setSelfData] = React.useState(null);

    React.useEffect(() => {
        getUserDataFromJwtReq().then(data => {
            setSelfData(data);
            //console.log(data);
        })
    }, [])

    React.useEffect(() => {

        socket.on('send-user-info', data => {
            socket.emit('send-user-info', selfData);

        })

        socket.on('user-joined-session', data => {
            setMembers(prevMems => [...prevMems, data])
            
        })

        socket.on('connected', message => {
            socket.emit('join-room', sessionId);
        })

        socket.on('connect-user', message => {
            
            const jwt = CookieManager.getCookie('jwt');
            if (jwt) {
                //console.log(jwt);
                socket.emit('connect-user', jwt);
                
            }
        })
        //console.log('here');

        socket.on('end-session', () => {

            window.location.assign('/');
        })

        socket.on('remove-user-session', data => {
            setMembers(prevMems => {
                return prevMems.filter(mem => mem._id !== data);
            })
        })

        return () => socket.close();
    }, [sessionId])

    React.useEffect(() => {
        if (selfData != null) {
            setMembers(prevMems => [...prevMems, selfData])
        }
    }, [selfData])

    const handleEndCLick = event => {
        event.preventDefault();
        console.log('end', sessionId);
        socket.emit('end-session', sessionId);
    }

    return (
        <div className="">
            <div className="px-6">
                <Members members={members} />
            </div>
            <div className="flex items-center justify-end mt-5">
                <p className="text-xl">Session: #{sessionId}</p>
                <button className="bg-purple-500 ml-2 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded " onClick={handleEndCLick}>end</button>
            </div>

            <Problems socket={socket} />
        </div>
    )
}