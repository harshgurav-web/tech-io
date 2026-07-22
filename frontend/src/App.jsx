import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'
import './App.css'
function App() {


  return (
    <>
      <header>

       
        <Show when="signed-out">
          <h1>hello from us</h1>
          <SignInButton mode='modal'/>
          <SignUpButton mode='modal'/>
        </Show>
        <Show when="signed-in">
          <h1>if youwant then bye from us</h1>
          <UserButton />
        </Show>
      </header>
    </>
  )
}

export default App
