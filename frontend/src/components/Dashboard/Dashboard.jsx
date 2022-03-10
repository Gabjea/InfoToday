import React from 'react';
import CookieManager from "./../../utils/CookieManager";
import io from 'socket.io-client';
import { faSolid, faArrowPointer } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CodeMirror from '@uiw/react-codemirror';
import { cpp } from '@codemirror/lang-cpp'
import axios from 'axios'
import { axiosInstanceToAPI } from './../../utils/axiosSv'

export default function Dashboard(props) {
    const startingCode = `
#include<iostream>
using namespace std;

int main(){
    

    return 0;
}
    `
    let refToMov = React.createRef();
    let [pos, setPos] = React.useState({ x: 0, y: 0 });
    let [name, setName] = React.useState('');
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
        const auxSocket = io(`ws://192.168.0.132:5000`);

        setSocket(auxSocket);

        auxSocket.on('connection', message => {
            console.log(message);
        })

        auxSocket.on('move-cursor', message => {
            const { pageX, pageY } = message.pos;
            setPos({ x: pageX, y: pageY });
            setName(message.name);
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
            socket.emit('move-cursor', ({ pageX, pageY }));
        }

        //console.log(refToMov);


    }, [socket])//*/

    React.useEffect(() => {

        refToMov.current.style.left = `${pos.x}px`;
        refToMov.current.style.top = `${pos.y}px`;
    })

    let [editorCode, setEditorCode] = React.useState(startingCode);
    let cmRef = React.createRef();
    const handleSubmit = event => {
        event.preventDefault();
        let code = '';/*
        console.log(editorCode);
        for (let ch of editorCode) {
            if (ch === '"') {

            }
        }//*/
        var data = JSON.stringify({
            "code": editorCode,
            "language": "cpp",
            "input": ""
        });
        console.log(editorCode);
        axiosInstanceToAPI.post("/user/compile", {code: editorCode} ).then(res => {
            console.log(res.data);
        })

    }

    return (
        <div>
            Dashboard!
            <br />
            <br />
            <br />
            <div ref={refToMov} id="movable" style={{ 'color': 'blue', 'position': 'absolute', 'left': 0, 'top': 0, 'userSelect': 'none' }} onLoad={() => {
            }}>
                <FontAwesomeIcon icon={faArrowPointer} />
                <small> {name}</small>
                {/* <ControlledEditor 
                    onBeforeChange={() => {}}
                    value={'sdfsdz'}
                    className="code-mirror-wrapper"
                    style= {{'position':'absolute', 'top':'5rem'}}
                    options={{
                      lineWrapping: true,
                      lint: true,
                      mode: 'cpp',
                      theme: 'material',
                      lineNumbers: true
                    }}
                /> */


                }
            </div>
            <CodeMirror
                ref={cmRef}
                value={startingCode}


                height="200px"
                extensions={[cpp()]}
                onChange={(value, viewUpdate) => {
                    console.log('value:', value);
                    setEditorCode(value);
                }}

            />

            <button onClick={handleSubmit} id='submit-code'>submit</button>
        </div>
    );
}