import React from 'react';
import { faArrowPointer } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import 'codemirror/theme/dracula.css'
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/dracula.css'
import 'codemirror/mode/clike/clike'
import 'codemirror/keymap/sublime'
import Problems from '../Problems/Problems';

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
        console.log('Connecting...');
        //console.log(socket);
        const auxSocket = props.socket;
        console.log(auxSocket == null);

        setSocket(auxSocket);

        auxSocket.on('connection', message => {
            console.log(message);
        })

        auxSocket.on('move-cursor', message => {
            const { pageX, pageY } = message.pos;
            if (pageX > window.innerWidth - (5 / 100) * window.innerWidth || pageX < 0 || pageY > window.innerHeight || pageY < 0) {
                //return;
            }
            setPos({ x: pageX, y: pageY });
            setName(message.name);
        })//*/
/*
        auxSocket.on('getname', () => {
            auxSocket.emit('getname', CookieManager.getCookie('jwt'));
        })//*/

        auxSocket.on('compile', message => {
            setOutput(message);
        })

        //return () => auxSocket.close();
    }, [props.socket]);//*/


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
    let [input, setInput] = React.useState();
    let [output, setOutput] = React.useState();
    const handleSubmit = event => {
        event.preventDefault();
        console.log(input);
        socket.emit('compile', { editorCode, input });
    }

    const [runnedForInput, setRunnedForInput] = React.useState(false);
    React.useEffect(() => {
        if (runnedForInput === false) {
            setRunnedForInput(true);
            return;
        }
        //console.log('runnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn');
        const editor = CodeMirror.fromTextArea(document.getElementById('input'), {
            lineNumbers: true,
            keyMap: 'sublime',
            theme: 'dracula',
            mode: 'text',
        });

        editor.setSize(window.innerWidth, 100);

        editor.on('beforeSelectionChange', (instance, { ranges, origin, update }) => {
            if (origin === '*mouse') {
                //console.log(ranges[0].anchor, ranges[0].head);
                let { line: startLine, ch: startCol } = ranges[0].anchor;
                let { line: endLine, ch: endCol } = ranges[0].head;
                //console.log(startLine, startCol, endLine, endCol);
                if (startLine > endLine) {
                    [startLine, endLine] = [endLine, startLine]
                }
                if (startCol > endCol) {
                    [startCol, endCol] = [endCol, startCol]
                }
                socket.emit('selection-input', { startLine, startCol, endLine, endCol });
            }

        })//*/

        editor.on('change', (instance, changes) => {
            const { origin } = changes;
            if (origin !== 'setValue') {
                socket.emit('edit-input', instance.getValue());
                setInput(instance.getValue());
            }
        })

        socket.on('edit-input', message => {
            //console.log(message);
            editor.setValue(message);
            setInput(message);
        })

        socket.on('selection-input', message => {
            //console.log(message);
            editor.markText(
                { line: 0, ch: 0 },
                { line: 1e9, ch: 1e9 },
                { css: "background-color: transparent" }
            )
            editor.markText(
                { line: message.startLine, ch: message.startCol },
                { line: message.endLine, ch: message.endCol },
                { css: "background-color: red" }
            )

        })
    }, [socket, runnedForInput])

    const [runned, setRunned] = React.useState(false);
    React.useEffect(() => {
        if (runned === false) {
            setRunned(true);
            return;
        }
        //console.log('runnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn');
        const editor = CodeMirror.fromTextArea(document.getElementById('codemirror'), {
            lineNumbers: true,
            keyMap: 'sublime',
            theme: 'dracula',
            mode: 'text/x-c++src'        });
        //editor.setValue('0123456789');
        
        editor.setValue(startingCode);
        editor.on('beforeSelectionChange', (instance, { ranges, origin, update }) => {
            if (origin === '*mouse') {
                //console.log(ranges[0].anchor, ranges[0].head);
                let { line: startLine, ch: startCol } = ranges[0].anchor;
                let { line: endLine, ch: endCol } = ranges[0].head;
                //console.log(startLine, startCol, endLine, endCol);
                if (startLine > endLine) {
                    [startLine, endLine] = [endLine, startLine]
                }
                if (startCol > endCol) {
                    [startCol, endCol] = [endCol, startCol]
                }
                socket.emit('selection', { startLine, startCol, endLine, endCol });
            }

        })//*/

        editor.on('change', (instance, changes) => {
            const { origin } = changes;
            if (origin !== 'setValue') {
                socket.emit('edit-code', instance.getValue());
                setEditorCode(instance.getValue());
            }
        })

        socket.on('edit-code', message => {
            //console.log(message);
            setEditorCode(message);
            editor.setValue(message);
        })

        socket.on('selection', message => {
            //console.log(message);
            editor.markText(
                { line: 0, ch: 0 },
                { line: 1e9, ch: 1e9 },
                { css: "background-color: transparent" }
            )
            editor.markText(
                { line: message.startLine, ch: message.startCol },
                { line: message.endLine, ch: message.endCol },
                { css: "background-color: red" }
            )

        })
    }, [socket, runned, startingCode])

    return (
        <div style={{ 'overflow': 'hidden' }}>
            {false && <Problems isSession={true} />}
            <br />
            <br />
            <br />

            <textarea id="codemirror" />
            <br />
            <br />
            <br />
            <textarea id="input" />

            <div ref={refToMov} id="movable" style={{ 'overflow': 'hidden', 'color': 'blue', 'position': 'absolute', 'left': 0, 'top': 0, 'userSelect': 'none' }} onLoad={() => {
            }}>
                <FontAwesomeIcon icon={faArrowPointer} />
                <small style={{ 'overflow': 'hidden' }}> {name}</small>
            </div>
            <hr />
            <div>{output}</div>
            <button onClick={handleSubmit} id='submit-code'>submit</button>
        </div>
    );
}