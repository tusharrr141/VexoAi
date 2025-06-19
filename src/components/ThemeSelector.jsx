import { Moon, Sun } from "lucide-react";

const ThemeSelector = ({ darkMode, setDarkMode }) => {
  return (
    <button
      onClick={() => setDarkMode(darkMode === "dark" ? "light" : "dark")}
      className="w-16 h-8 bg-zinc-300 dark:bg-zinc-700 rounded-full flex items-center px-1 relative transition-colors duration-300"
    >
      {/* Toggle Thumb */}
      <div
        className={`w-6 h-6 bg-white rounded-full shadow-md absolute top-1 transition-transform duration-300 ${
          darkMode === "dark" ? "translate-x-8" : "translate-x-1"
        }`}
      />

      {/* Sun Icon */}
      <div className="absolute left-1.5 top-1.5 text-yellow-500 transition-opacity duration-300">
        <Sun className={`w-4 h-4 ${darkMode === "dark" ? "opacity-50" : "opacity-100"}`} />
      </div>

      {/* Moon Icon */}
      <div className="absolute right-1.5 top-1.5 text-blue-900 transition-opacity duration-300">
        <Moon className={`w-4 h-4 ${darkMode === "dark" ? "opacity-100" : "opacity-50"}`} />
      </div>
    </button>
  );
};

export default ThemeSelector;
