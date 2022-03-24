import React from "react"
import { useParams } from "react-router-dom";
import CookieManager from '../../utils/CookieManager';
import { baseWsURL, getUserDataFromJwtReq } from './../../utils/serverAPI';
import io from 'socket.io-client';
import Problems from '../Problems/Problems';
import './Session.css'
const socket = io(baseWsURL);

export default function Session() {
    const { id: sessionId } = useParams();
    const [role, setRole] = React.useState();

    React.useEffect(() => {
        getUserDataFromJwtReq().then(({ role, coins }) => {
            setRole(role);
        })
    }, [])

    React.useEffect(() => {
        if (role === 'student') {
            socket.emit('pay', sessionId);
        }
    }, [role, sessionId])

    React.useEffect(() => {

        socket.on('connected', message => {
            socket.emit('join-room', sessionId);
        })

        socket.on('connect-user', message => {
            //console.log(message);
            const jwt = CookieManager.getCookie('jwt');
            if (jwt) {
                //console.log(jwt);
                socket.emit('connect-user', jwt);
            }
        })
        //console.log('here');

        socket.on('end-session', () => {
            alert();
            window.location.assign('/');
        })

        return () => socket.close();
    }, [sessionId])

    const handleEndCLick = event => {
        event.preventDefault();

        socket.emit('end-session', sessionId);
    }

    return (
        <div>
            {
                role === 'teacher' && <button onClick={handleEndCLick}>end</button>
            }

            <Problems socket={socket} />
        </div>
    )
}