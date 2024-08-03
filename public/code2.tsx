import { useReducer } from 'react'

// OPTION 2: toggle a boolean value with `useReducer`
const Button = () => {
  const [isOpen, toggle] = useReducer((prevIsOpen) => !prevIsOpen, false)

  return <button onClick={toggle}>Click</button>
}
