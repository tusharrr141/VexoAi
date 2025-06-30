import { useEffect, useState } from "react";
import Home from "./components/Home";
import VexoAILandingPage from "./components/VexoAILandingPage";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState("dark");
  const [name, setName] = useState("");
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode === "dark");
  }, [darkMode]);

  // ✅ Handler to receive the name from VexoAILandingPage
  const handleNameSubmitted = (submittedName) => {
    setName(submittedName);
    setEntered(true);
  };

  if (!entered) {
    return <VexoAILandingPage onNameSubmitted={handleNameSubmitted} />;
  }

  return (
    <div className={`${darkMode} h-screen`}>
      <Home name={name} darkMode={darkMode} setDarkMode={setDarkMode} />
    </div>
  );
}

export default App;
