import { useState, useReducer } from 'react'

// OPTION 1: toggle a boolean value with `useState`
const Button = () => {
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => setIsOpen((prevIsOpen) => !prevIsOpen)

  return <button onClick={toggle}>Click</button>
}

// import { useReducer } from 'react'

// OPTION 2: toggle a boolean value with `useReducer`
const Button2 = () => {
  const [isOpen, toggle] = useReducer((prevIsOpen) => !prevIsOpen, false)

  return <button onClick={toggle}>Click</button>
}
