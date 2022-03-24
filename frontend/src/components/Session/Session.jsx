import React from "react"
import { useParams } from "react-router-dom";
import CookieManager from '../../utils/CookieManager';
import { baseWsURL } from './../../utils/serverAPI';
import io from 'socket.io-client';
import Problems from '../Problems/Problems';
import './Session.css'
const socket = io(baseWsURL);

export default function Session() {
    const { id: sessionId } = useParams();

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
        return () => socket.close();
    }, [sessionId])
    
    return (
        <div>
            <Problems socket={socket} />
        </div>
    )
}