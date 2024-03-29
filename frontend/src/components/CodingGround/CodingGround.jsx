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
           
            setPos({ x: pageX * window.innerWidth, y: pageY * window.innerHeight });
            setName(message.name);
        })//*/

        auxSocket?.on('compile', message => {
            console.log(message);
            setAnswers(message.ans);
            setErrorMsg(message.err)
            //setOutput(message);
        })

        return () => auxSocket?.close();
    }, [props.socket]);//*/

    //---------------------------------------
    React.useEffect(() => {
        document.onmousemove = event => {
            const { pageX, pageY } = event;
            
            props.socket?.emit('move-cursor', ({ 
                pageX: pageX / window.innerWidth,
                 pageY: pageY / window.innerHeight
            }));
        }
    }, [props.socket])//*/

    React.useEffect(() => {
        
        refToMov.current.style.left = `${pos.x}px`;
        refToMov.current.style.top = `${pos.y}px`;
    })

    let [editorCode, setEditorCode] = React.useState(startingCode);
    let [input, setInput] = React.useState();

    const [answers, setAnswers] = React.useState([]);
    const [errorMsg, setErrorMsg] = React.useState('');
    const handleSubmit = event => {
        event.preventDefault();
        if (socket == null) {
            axiosAuthInstanceToAPI.post(`/user/problem/evaluate/${props.pbName}`, {
                editorCode, input
            }).then(res => {
                //console.log(res.data);
                setAnswers(res.data.ans);
                setErrorMsg(res.data.err);
            }, err => {
                console.error(err);
                alert('ERROR!');
            })
        } else {
            socket.emit('compile', { editorCode, input, jwt: CookieManager.getCookie('jwt'), problem: props.pbName });
        }
    }

    return (
        <div style={{ 'overflow': 'hidden' }}>
            <div className=''>

            <MemoizedTextArea
                socket={props.socket}
                startVal={startingCode}
                setEditorVal={setEditorCode}
                mode={'text/x-c++src'}
                editorType={'code'}
            />
            </div>
            
            
             {socket != null && (<div ref={refToMov}
            className = "text-pink-600"
            id="movable" style={{ 'overflow': 'hidden', 'position': 'absolute', 'left': 0, 'top': 0, 'userSelect': 'none' }}>
                <FontAwesomeIcon  icon={faArrowPointer}     />
                <small style={{ 'overflow': 'hidden' }}> {name} </small>
            </div>) || (<div ref={refToMov}></div>)}

            
            <div className='text-xl'>
                { errorMsg === '' && (
                    answers.map((ans, index) => <div key={index} className={`${ans ? 'bg-green-700' : 'bg-red-500'} `}>Test #{index}: {ans ? 'CORECT' : 'GRESIT'}</div>)
                ) || (<div className="bg-red-500 max-w-fit">{errorMsg}</div>)}
            </div>
            <button className="bg-purple-500 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded mt-2" onClick={handleSubmit} id='submit-code'>Evalueaza</button>
        </div>
    );
}