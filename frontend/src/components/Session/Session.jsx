import React from 'react';
import { useParams } from "react-router-dom";
import CookieManager from '../../utils/CookieManager';
import { baseWsURL } from './../../utils/serverAPI';
import io from 'socket.io-client';
import Problems from '../Problems/Problems';
const socket = io(baseWsURL);


export default function Session() {
    const { id: sessionId } = useParams();
    const [connected, setConnected] = React.useState();

    React.useEffect(() => {
        socket.on('session-user-connected', message => {
            console.log(message);
        })

        socket.on('connected', message => {
            //console.log(message);
            setConnected(message);
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

    React.useEffect(() => {
        if (connected) {
            socket.emit('join-session', '');
        }
    }, [connected])

    return (
        <div>
            Session #{sessionId}
            <Problems socket={socket} />
        </div>
    );
}