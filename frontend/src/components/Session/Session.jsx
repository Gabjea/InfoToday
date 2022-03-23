import React from 'react';
import { useParams } from "react-router-dom";
import CookieManager from '../../utils/CookieManager';
import { baseWsURL, host } from './../../utils/serverAPI';
import io from 'socket.io-client';
import Problems from '../Problems/Problems';
import Peer from 'peerjs';
import './Session.css'
import { faL } from '@fortawesome/free-solid-svg-icons';
//myVideo.muted = true
const socket = io(baseWsURL);

export default function Session() {
    const { id: sessionId } = useParams();
    const [connected, setConnected] = React.useState();

    React.useEffect(() => {

        socket.on('connected', message => {
            setConnected(message);
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

    //------------------------------------------------------------

    return (
        <div>
            Session #{sessionId}

            <hr />
            <Problems socket={socket} sessionId={sessionId} />
        </div>
    );
}