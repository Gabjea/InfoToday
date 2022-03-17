import React from 'react';
import { faArrowPointer } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import 'codemirror/theme/dracula.css'
import MemoizedTextArea from './TextArea';
import { axiosAuthInstanceToAPI } from '../../utils/serverAPI';
import CookieManager from '../../utils/CookieManager';

export default function CodingGround(props) {
    const startingCode = `#include<iostream>
using namespace std;

int main(){
    //add your code here
    return 0;
}
    `
    let refToMov = React.createRef();
    let [pos, setPos] = React.useState({ x: 0, y: 0 });
    let [name, setName] = React.useState('');


    const [socket, setSocket] = React.useState(null);
    React.useEffect(() => {
        const auxSocket = props.socket;

        setSocket(auxSocket);

        auxSocket?.on('connection', message => {
            console?.log(message);
        })

        auxSocket?.on('move-cursor', message => {
            const { pageX, pageY } = message.pos;
            if (pageX > window.innerWidth - (5 / 100) * window.innerWidth || pageX < 0 || pageY > window.innerHeight || pageY < 0) {
                //return;
            }
            setPos({ x: pageX, y: pageY });
            setName(message.name);
        })//*/

        auxSocket?.on('compile', message => {
            //setOutput(message);
        })

        return () => auxSocket?.close();
    }, [props.socket]);//*/

    //---------------------------------------
    React.useEffect(() => {
        document.onmousemove = event => {
            const { pageX, pageY } = event;
            props.socket?.emit('move-cursor', ({ pageX, pageY }));
        }
    }, [props.socket])//*/

    React.useEffect(() => {
        refToMov.current.style.left = `${pos.x}px`;
        refToMov.current.style.top = `${pos.y}px`;
    })

    let [editorCode, setEditorCode] = React.useState(startingCode);
    let [input, setInput] = React.useState();

    const [answers, setAnswers] = React.useState([]);
    const handleSubmit = event => {
        event.preventDefault();
        if (socket == null) {
            axiosAuthInstanceToAPI.post(`/user/problem/compile/${props.pbName}`, {
                editorCode, input
            }).then(res => {
                //console.log(res.data);
                setAnswers(res.data.ans);
            }, err => {
                console.error(err);
                alert('ERROR!');
            })
        }
        socket?.emit('compile', { editorCode, input, jwt: CookieManager.getCookie('jwt') });
    }

    return (
        <div style={{ 'overflow': 'hidden' }}>
            <MemoizedTextArea
                socket={props.socket}
                startVal={startingCode}
                setEditorVal={setEditorCode}
                mode={'text/x-c++src'}
                editorType={'code'}
            />
            <br />
            <br />
            <br />
            <MemoizedTextArea
                socket={props.socket}
                startVal={''}
                setEditorVal={setInput}
                mode={'text'}
                editorType={'input'}
            />
            <div ref={refToMov} id="movable" style={{ 'overflow': 'hidden', 'color': 'blue', 'position': 'absolute', 'left': 0, 'top': 0, 'userSelect': 'none' }}>
                <FontAwesomeIcon icon={faArrowPointer} />
                <small style={{ 'overflow': 'hidden' }}> {name} </small>
            </div>

            <hr />
            <div>
                {
                    answers.map((ans, index) => <div key={index} className={`${ans ? 'bg-green-700' : 'bg-red-500'}`}>Test #{index}: {ans ? 'CORECT' : 'GRESIT'}</div> )
                }
            </div>
            <button onClick={handleSubmit} id='submit-code'>submit</button>
        </div>
    );
}