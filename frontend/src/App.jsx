import { useUser } from "@clerk/clerk-react";
import { Toaster } from 'react-hot-toast';
import { Routes, Route, Navigate } from "react-router";
import HomePage from "./pages/homePage";
import AboutPage from "./pages/aboutPage";
import ProblemPage from "./pages/ProblemPage";
import ProblemIDPage from "./pages/ProblemIDPage";
import Dashboard from "./pages/Dashboard";



function App() {
  const { isSignedIn, isLoaded } = useUser();
  // use for get rid out of flicker effect in dashboard and sudden loading swith o homw
  if(!isLoaded) return null;
  
  return (
    <>

      <Routes>
        <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to={"/dashboard"} />} />
        <Route path="/dashboard" element={isSignedIn ? <Dashboard /> : <Navigate to={"/"} />} />

        <Route path="/about" element={<AboutPage />} />
        <Route path="/problems" element={isSignedIn ? <ProblemPage /> : <Navigate to={"/"} />} />
        <Route path="/problem/:id" element={isSignedIn ? <ProblemIDPage /> : <Navigate to={"/"} />} />
      </Routes>

            <Toaster />
    </>
  );
}
export default App;