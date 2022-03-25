import React from 'react';
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/dracula.css'
import 'codemirror/mode/clike/clike'
import 'codemirror/keymap/sublime'
const EDITOR_HEIGHT = 300;

function TextArea({ socket, startVal, setEditorVal, mode, editorType }) {
    const [runned, setRunned] = React.useState(false);
    let editor = React.createRef();

    React.useEffect(() => {
        window.addEventListener(`resize`, () => {
            editor.current?.setSize(window.innerWidth / 2, EDITOR_HEIGHT);
        })
    }, [editor])

    React.useEffect(() => {
        if (!runned) {
            setRunned(true);
            return;
        }
        editor.current = CodeMirror.fromTextArea(document.getElementById(`${editorType}`), {
            lineNumbers: true,
            keyMap: `sublime`,
            theme: `dracula`,
            mode
        });

        editor.current.setSize(window.innerWidth / 3, EDITOR_HEIGHT);
        editor.current.setValue(startVal);

        editor.current.on(`beforeSelectionChange`, (instance, { ranges, origin, update }) => {
            if (origin === `*mouse`) {
                let { line: startLine, ch: startCol } = ranges[0].anchor;
                let { line: endLine, ch: endCol } = ranges[0].head;
                if (startLine > endLine) {
                    [startLine, endLine] = [endLine, startLine]
                }
                if (startCol > endCol) {
                    [startCol, endCol] = [endCol, startCol]
                }
                socket?.emit(`selection-${editorType}`, { startLine, startCol, endLine, endCol });
            }

        })//*/

        editor.current.on(`change`, (instance, changes) => {
            const { origin } = changes;
            if (origin !== `setValue`) {
                socket?.emit(`edit-${editorType}`, instance.getValue());
                setEditorVal(instance.getValue());
            }
        })

        socket?.on(`edit-${editorType}`, message => {
            setEditorVal(message);
            editor.current.setValue(message);
        })

        socket?.on(`selection-${editorType}`, message => {
            editor.current.markText(
                { line: 0, ch: 0 },
                { line: 1e9, ch: 1e9 },
                { css: "background-color: transparent" }
            )
            editor.current.markText(
                { line: message.startLine, ch: message.startCol },
                { line: message.endLine, ch: message.endCol },
                { css: "background-color: red" }
            )
        })
    }, [socket, editor, runned, editorType, mode, setEditorVal, startVal])

    return (
        <div>
            <textarea id={editorType} />
        </div>
    );
}

const MemoizedTextArea = React.memo(TextArea);
export default MemoizedTextArea;