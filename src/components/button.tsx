import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ComponentProps } from 'react'
import { overrideTailwindClasses } from 'tailwind-override'

export const Button = ({
  icon,
  text,
  loading = false,
  ...props
}: {
  icon: ComponentProps<typeof FontAwesomeIcon>['icon']
  text?: string
  loading?: boolean
} & Omit<ComponentProps<'button'>, 'children'>) => (
  <button
    {...props}
    className={overrideTailwindClasses(
      'block flex items-center gap-1 rounded-full border border-black py-2 px-2.5 text-sm font-bold text-white outline-none ring-white ring-offset-0 ring-offset-black hover:border-gray-700 hover:bg-gray-900 focus:z-10 focus:ring disabled:opacity-50 disabled:hover:border-gray-800 disabled:hover:bg-black ' +
        props.className
    )}>
    {!!text && text}
    {(!text || !loading) && (
      <FontAwesomeIcon icon={icon} className={'block h-4 w-4 '} />
    )}
    {loading && (
      <FontAwesomeIcon
        icon={faSpinner}
        className={'block h-4 w-4 animate-spin'}
      />
    )}
  </button>
)

// const SplitButton = ({
//   leftIcon: LeftIcon,
//   rightIcon: RightIcon,
//   leftOnClick,
//   rightOnClick,
//   leftText,
//   rightText,
// }: {
//   leftIcon: typeof AcademicCapIcon
//   rightIcon: typeof AcademicCapIcon
//   leftOnClick: () => void
//   rightOnClick: () => void
//   leftText?: string
//   rightText?: string
// }) => (
//   <div className='flex flex-row'>
//     <button
//       onClick={leftOnClick}
//       className='ml-1 mb-1 block flex rounded-l-full border border-gray-700 bg-gray-800 py-2 px-2.5 text-sm text-white outline-none ring-white ring-offset-0 ring-offset-black hover:border-gray-600 hover:bg-gray-700 focus:z-10 focus:ring'>
//       {!!leftText && <div className='mr-1'>{leftText}</div>}
//       <LeftIcon className='block h-5 w-5' />
//     </button>
//     <button
//       onClick={rightOnClick}
//       className='-ml-0.5 mb-1 block flex rounded-r-full border border-gray-700 bg-gray-800 py-2 px-2.5 text-sm text-white outline-none ring-white ring-offset-0 ring-offset-black hover:border-gray-600 hover:bg-gray-700 focus:z-10 focus:ring'>
//       {!!rightText && <div className='mr-1'>{rightText}</div>}
//       <RightIcon className='block h-5 w-5' />
//     </button>
//   </div>
// )
