import { useEffect, useState } from "react";
import Home from "./components/Home";
import AnimatedCard from "./components/AnimatedCard";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState("dark");
  const [name, setName] = useState("");
  const [entered, setEntered] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode === "dark");
  }, [darkMode]);

  const handleEnter = () => {
    if (inputValue.trim() !== "") {
      setName(inputValue.trim());
      setEntered(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleEnter();
  };

  if (!entered) {
    return (
      <AnimatedCard
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleEnter={handleEnter}
        handleKeyDown={handleKeyDown}
      />
    );
  }

  return (
    <div className={`${darkMode} h-screen`}>
      <Home name={name} darkMode={darkMode} setDarkMode={setDarkMode} />
    </div>
  );
}

export default App;
