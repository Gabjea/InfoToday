import React from 'react';
import CookieManager from "./../../utils/CookieManager";
import io from 'socket.io-client';
import { faSolid, faArrowPointer } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default function Dashboard(props) {
    let refToMov = React.createRef();
    let [pos, setPos] = React.useState({ x: 0, y: 0 });

    React.useEffect(() => {
        if (CookieManager.getCookie('jwt') == null) {
            window.location.assign('/login');
            return;
        }
    }, [])

    const [socket, setSocket] = React.useState(null);
    React.useEffect(() => {
        console.log('Connecting...');
        //console.log(socket);
        const auxSocket = io(`ws://79.115.133.126:5000`);

        setSocket(auxSocket);

        auxSocket.on('connection', message => {
            console.log(message);
        })

        auxSocket.on('move-cursor', message => {
            const { pageX, pageY } = message.data.pos;
            setPos({ x: pageX, y: pageY });
        })//*/

        auxSocket.on('getname', () => {
            auxSocket.emit('getname', CookieManager.getCookie('jwt'));
        })

        return () => auxSocket.close();
    }, []);//*/


    //---------------------------------------
    React.useEffect(() => {
        document.onmousemove = event => {
            const { pageX, pageY } = event;

            //console.log(refToMov);
            //console.log(pageX, pageY);
            socket.emit('move-cursor', ({ pos: { pageX, pageY } }));
        }

        //console.log(refToMov);


    }, [socket])//*/

    React.useEffect(() => {
        console.log('kkkkkk');
        refToMov.current.style.left = `${pos.x}px`;
        refToMov.current.style.top = `${pos.y}px`;
    })

    return (
        <div>
            Dashboard!
            <br />
            <br />
            <br />
            <div ref={refToMov} id="movable" style={{ 'color': 'blue', 'position': 'absolute', 'left': 0, 'top': 0, 'userSelect': 'none' }} onLoad={() => {
            }}>
                <FontAwesomeIcon icon={faArrowPointer } />

            </div>
        </div>
    );
}