import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import EmailApp from './components/Email'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <EmailApp />
    </>
  )
}

export default App
