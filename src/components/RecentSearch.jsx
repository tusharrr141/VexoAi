import { X } from "lucide-react";

function RecentSearch({
  recentHistory,
  setRecentHistory,
  setSelectedHistory,
  selectedHistory,
  setResult,
  isMenuOpen,
  setIsMenuOpen,
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
    <div className="h-[95%] fixed w-full md:w-[20%] custom-scrollbar flex flex-col p-4">
      <div className=" items-center mb-3 ">
        <h2 className="text-lg  font-semibold dark:text-white text-zinc-800">
          Recent Searches
        </h2>
        <button
          onClick={clearHistory}
          className="border border-zinc-400 rounded-xl bg-zinc-500  flex items-center justify-center mt-3 hover:bg-red-600/80 cursor-pointer"
          title="Clear All"
        >
          <p className="px-4 py-1 text-center text-white">Clear all</p>
        </button>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden absolute top-5 right-8"
        >
          <X className="size-5 " />
        </button>
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
