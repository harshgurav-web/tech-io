import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'
import './App.css'

function App() {


  return (
    <>
      <header>
        <h1>hello from TECH-IQ</h1>
        <Show when="signed-out">
          <SignInButton mode='modal' />
          <SignUpButton mode='modal' />
        </Show>
        <Show when="signed-in">
          <UserButton />

        </Show>
      </header>
    </>
  )
}

export default App
