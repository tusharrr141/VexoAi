import ThemeSelector from "./ThemeSelector";

function RecentSearch({
  recentHistory,
  setRecentHistory,
  setSelectedHistory,
  selectedHistory,
  setResult,
  darkMode,
  setDarkMode,
}) {
  const clearHistory = () => {
    localStorage.clear();
    setRecentHistory([]);
    setSelectedHistory("");
    setResult([]); // Clear answer too

  };

  const clearSelectedHistory = (selectedItem) => {
    let history = JSON.parse(localStorage.getItem("history")) || [];
    history = history.filter((item) => item !== selectedItem);
    setRecentHistory(history);
    localStorage.setItem("history", JSON.stringify(history));

    // 🧠 If deleted item is the current selection, also reset answer & selection
    if (selectedItem === selectedHistory) {
      setSelectedHistory("");
      setResult([]);
    }
  };

  return (
    <div className="h-[95%] fixed w-[20%] custom-scrollbar flex flex-col p-4">
      <div className="flex justify-between items-center mb-16">
        <h2 className="text-lg font-semibold dark:text-white text-zinc-800">
          Recent Searches
        </h2>
        <button
          onClick={clearHistory}
          className="text-xs px-2 py-1 bg-zinc-700 hover:bg-zinc-800 text-white rounded"
          title="Clear All"
        >
          Clear All
        </button>
      </div>

  <div className="absolute top-28 left-0 z-20 mb-1">
      <ThemeSelector darkMode={darkMode} setDarkMode={setDarkMode}/>
  </div>
    
      

      {/* Scrollable history list */}
      <ul className="flex-1 custom-scrollbar space-y-2 pr-1">
        {recentHistory?.length > 0 ? (
          recentHistory.map((item, index) => (
            <li
              key={index}
              className="flex items-center justify-between bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 hover:bg-red-200 transition rounded-lg px-3 py-2 cursor-pointer text-sm text-zinc-800 dark:text-zinc-300"
            >
              <span
                onClick={() => setSelectedHistory(item)}
                className="truncate w-[80%] hover:underline"
              >
                {item}
              </span>
              <button
                onClick={() => clearSelectedHistory(item)}
                className="text-red-600 hover:text-red-400"
                title="Delete"
              >
                &#x2715;
              </button>
            </li>
          ))
        ) : (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 italic">
            No history yet
          </p>
        )}
      </ul>
    </div>
  );
}

export default RecentSearch;
