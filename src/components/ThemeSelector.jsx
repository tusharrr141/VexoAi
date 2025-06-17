import { Moon, Sun } from 'lucide-react'
import React from 'react'

const ThemeSelector = ({darkMode, setDarkMode}) => {
  return (
   
  <button
    onClick={() => setDarkMode(darkMode === "dark" ? "light" : "dark")}
    className="w-16 h-8 bg-zinc-500 dark:bg-zinc-900 rounded-full flex items-center transition-colors duration-300 relative"
  >
    
    <div
      className={`w-6 h-6 bg-white rounded-full shadow-md absolute top-1 left-1 transition-transform duration-300 ${
        darkMode === "dark" ? "translate-x-8" : "translate-x-0"
      }`}
    />

   
    <div
      className={`absolute left-1.5 top-1.5 w-5 h-5 transition-opacity duration-300 -px-[3px] ${
        darkMode === "dark" ? "opacity-50" : "opacity-100"
      } text-yellow-500`}
    >
      <Sun className="size-5" />
    </div>

    
    <div
      className={`absolute right-1.5 top-1.5 w-5 h-5 transition-opacity duration-300 ${
        darkMode === "dark" ? "opacity-100" : "opacity-50"
      } text-blue-900`}
    >
      <Moon className="size-5" />
    </div>
  </button>
</div> 
  )
}

export default ThemeSelector