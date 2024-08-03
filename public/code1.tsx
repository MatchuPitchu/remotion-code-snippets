import { useState } from 'react'

// OPTION 1: toggle a boolean value with `useState`
const Button = () => {
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => setIsOpen((prevIsOpen) => !prevIsOpen)

  return <button onClick={toggle}>Click</button>
}
