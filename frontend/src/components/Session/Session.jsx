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
        window.onbeforeunload = () => alert()
        getUserDataFromJwtReq().then(({ role, coins }) => {
            setRole(role);
        })
    }, [])

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
            <div className="flex items-center justify-end px-3 mt-5">
            <p className="text-xl">Session: #{sessionId}</p>
            <button className="bg-purple-500 ml-2 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded " onClick={handleEndCLick}>end</button>
            </div>

            <Problems socket={socket} />
        </div>
    )
}