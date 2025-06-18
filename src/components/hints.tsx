import { useState } from 'react'
import { KeyAction } from '../hooks/useKeyAction'

type HintProps = {
  keyLetter: string
  description: string
}

const Hint = ({ keyLetter, description }: HintProps) => (
  <li>
    <kbd className='mb-1 mr-2 inline-block rounded-full bg-gray-700 px-3 py-1 text-xs font-medium leading-5 text-white text-white'>
      {keyLetter}
    </kbd>
    {description}
  </li>
)

const Hints = ({ keyActions }: { keyActions: KeyAction[] }) => {
  const [show, setShow] = useState(false)
  return (
    <>
      {show && (
        <>
          <div className='fixed inset-0 bg-black bg-opacity-75 transition-opacity' />
          <div className='fixed left-1/2 top-1/2 -translate-x-2/4 -translate-y-2/4 transform overflow-hidden rounded-lg border border-gray-700 bg-gray-900 px-4 pb-4 pt-5 text-left text-sm text-white shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6'>
            <div>
              <div className='text-left'>
                <ul className='list-inside pt-1'>
                  {keyActions.map(({ key: keyLetter, description }) => (
                    <Hint key={keyLetter} {...{ keyLetter, description }} />
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
      <button
        onClick={() => setShow(s => !s)}
        className='fixed right-0 top-0 hidden rounded p-2 text-sm text-gray-400 outline-none ring-white ring-offset-1 ring-offset-black focus:z-10 focus:ring md:block'>
        (click for shortcut hints)
      </button>
    </>
  )
}

export default Hints
