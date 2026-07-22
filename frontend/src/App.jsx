import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";

import "./App.css";

function App() {
  return (
    <>
      <header>
        <SignedOut>
          <h1>Hello from us</h1>
          <SignInButton mode="modal" />
          <SignUpButton mode="modal" />
        </SignedOut>

        <SignedIn>
          <h1>If you want then bye from us</h1>
          <UserButton />
        </SignedIn>
      </header>
    </>
  );
}

export default App;