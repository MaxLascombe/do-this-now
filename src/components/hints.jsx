import { useState } from 'react'
import useKeyAction from '../hooks/useKeyAction'

const Hint = ({ letter, text }) => (
    <li>
        <kbd className='inline-block bg-gray-700 rounded-full px-3 py-1 text-sm text-white font-medium leading-5 text-white mr-2 mb-1'>
            {letter}
        </kbd>
        {text}
    </li>
)

const Hints = ({ keyActions }) => {
    const [show, setShow] = useState(false)

    const hintKeyActions = [['h', 'Show hints', () => setShow(true)]]
    useKeyAction(hintKeyActions)
    const hintKeyUpActions = [['h', 'Show hints', () => setShow(false)]]
    useKeyAction(hintKeyUpActions, 'keyup')

    return (
        <div>
            {show && (
                <>
                    <div className='fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity' />
                    <div className='absolute top-1/2 left-1/2 -translate-x-2/4 -translate-y-2/4 bg-gray-800 border border-gray-700 rounded px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-sm sm:w-full sm:p-6 text-white'>
                        <div>
                            <div className='text-left'>
                                <ul className='list-disc list-inside pt-1'>
                                    {keyActions.map(([letter, text]) => (
                                        <Hint
                                            key={letter}
                                            {...{ letter, text }}
                                        />
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </>
            )}
            <span
                onClick={() => setShow((x) => !x)}
                className='text-gray-400 absolute top-2 right-2 text-sm'>
                (<i>h</i> for hint)
            </span>
        </div>
    )
}

export default Hints
