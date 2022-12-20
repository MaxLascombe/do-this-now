import { PuzzleIcon } from '@heroicons/react/solid'

const Loading = ({ light = true }) => (
    <PuzzleIcon
        className={
            (light ? 'text-gray-600' : 'text-gray-200') +
            ' w-10 h-10 animate-pulse mx-auto'
        }
    />
)

export default Loading
