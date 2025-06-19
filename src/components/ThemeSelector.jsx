import { Moon, Sun } from "lucide-react";

const ThemeSelector = ({ darkMode, setDarkMode }) => {
  const isDark = darkMode === "dark";

  return (
    <button onClick={() => setDarkMode(isDark ? "light" : "dark")} className="">
      {/* Conditional Icon */}
      <div className=" dark:bg-zinc-600 bg-zinc-100 p-2 rounded-xl flex items-center justify-center cursor-pointer transition-transform duration-300">
        {isDark ? (
          <Moon className="size-5 text-cyan-500/70" />
        ) : (
          <Sun className="size-5 text-amber-400/70" />
        )}
      </div>
    </button>
  );
};

export default ThemeSelector;
