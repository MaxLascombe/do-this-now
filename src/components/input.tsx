import { ComponentProps } from 'react'
import { twMerge as tw } from 'tailwind-merge'

export const Input = ({ className, ...props }: ComponentProps<'input'>) => (
  <input
    {...props}
    className={tw(
      'block w-96 min-w-0 flex-1 rounded border border-gray-800 bg-black p-2.5 text-white placeholder-gray-400 outline-none ring-white ring-offset-0 ring-offset-black hover:bg-gray-900 focus:border-gray-700 focus:border-blue-500 focus:bg-gray-900 focus:ring sm:text-sm',
      className
    )}
  />
)
