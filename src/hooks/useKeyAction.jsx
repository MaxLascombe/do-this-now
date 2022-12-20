import { useCallback, useEffect } from 'react'

const useKeyAction = (keyActions, event = 'keydown') => {
    const callback = useCallback(
        (e) => {
            for (const kA of keyActions) if (kA[0] === e.key) kA[2](e)
        },
        [keyActions]
    )
    return useEffect(() => {
        document.addEventListener(event, callback)
        return () => {
            document.removeEventListener(event, callback)
        }
    }, [keyActions, event, callback])
}

export default useKeyAction
