const Button = ({ icon, onClick, text }) => {
    const Icon = icon
    return (
        <button
            onClick={onClick}
            className='block p-2 bg-gray-800 border border-gray-700 rounded text-sm text-white hover:bg-gray-700 hover:border-gray-600 ml-2 mb-2'>
            <span>{text}</span>
            <Icon className='h-5 w-5 ml-1 inline-block' />
        </button>
    )
}

export default Button
