import { useEffect, useRef, useState } from "react";
import { URL } from "../constants";
import RecentSearch from "./RecentSearch";
import QuestionAnswer from "./QuestionAnswer";
import { Moon, Sun } from "lucide-react";
import ThemeSelector from "./ThemeSelector";

function Home({ name, darkMode, setDarkMode }) {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState([]);
  const [recentHistory, setRecentHistory] = useState(
    JSON.parse(localStorage.getItem("history")) || []
  );
  const [selectedHistory, setSelectedHistory] = useState("");
  const [loader, setLoader] = useState(false);

  const containerRef = useRef(null);
  const lastQuestionRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode === "dark");
  }, [darkMode]);

  const askQuestion = async () => {
    if (!question && !selectedHistory) return;

    const query = question || selectedHistory;

    if (question) {
      let history = JSON.parse(localStorage.getItem("history")) || [];
      history = [question, ...history.slice(0, 19)].map(
        (item) => item.charAt(0).toUpperCase() + item.slice(1).trim()
      );
      history = [...new Set(history)];
      localStorage.setItem("history", JSON.stringify(history));
      setRecentHistory(history);
    }

    const payload = {
      contents: [{ parts: [{ text: query }] }],
    };

    setLoader(true);
    let response = await fetch(URL, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    response = await response.json();

    let dataString = response.candidates[0].content.parts[0].text;

    // Ensure result is always an array
    let dataList = dataString.includes("* ")
      ? dataString
          .split("* ")
          .filter(Boolean)
          .map((s) => s.trim())
      : [dataString.trim()];

    setResult((prev) => [
      ...prev,
      { type: "q", text: query },
      { type: "a", text: dataList },
    ]);

    setQuestion("");
    setSelectedHistory("");
    setLoader(false);
  };

  const isEnter = (e) => {
    if (e.key === "Enter") askQuestion();
  };

  useEffect(() => {
    if (lastQuestionRef.current) {
      lastQuestionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [result]);

  useEffect(() => {
    if (selectedHistory) askQuestion();
  }, [selectedHistory]);

  return (
    <div className="grid grid-cols-5 h-full custom-scrollbar bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
      {/* Sidebar */}
      <div className="border-r border-zinc-700 dark:border-zinc-600">
        <RecentSearch
          recentHistory={recentHistory}
          setRecentHistory={setRecentHistory}
          setSelectedHistory={setSelectedHistory}
          selectedHistory={selectedHistory}
          setResult={setResult}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      </div>

      {/* Main content area */}
      <div className="col-span-4 p-6 flex flex-col h-screen overflow-hidden">

        {/* Greeting with Name */}
        <h1 className="text-3xl mb-2 font-semibold text-center text-zinc-500">
          Hello <span className="text-pink-500 font-bold">{name}</span> 👋
        </h1>

        {/* Main Heading */}
        <h2 className="text-4xl mb-4 text-center font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-violet-700">
          Ask me Anything
        </h2>

        {/* Loader */}
        {loader && (
          <div className="flex justify-center items-center mb-4">
            <div className="w-6 h-6 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Q&A Section */}
        <div
          ref={containerRef}
          className="flex-1 custom-scrollbar pr-4 dark:text-zinc-300 text-zinc-800 space-y-3"
        >
          {result.map((item, index) => {
            const isLatestQuestion =
              item.type === "q" && index === result.length - 2;
            return (
              <div key={index} ref={isLatestQuestion ? lastQuestionRef : null}>
                <QuestionAnswer item={item} index={index} />
              </div>
            );
          })}
        </div>

        {/* Input Box */}
        <div className="w-full flex justify-center mt-6 mb-6">
          <div className="w-full max-w-3xl border border-zinc-300 dark:border-zinc-600 rounded-3xl flex items-center px-4 py-2 bg-zinc-100 dark:bg-zinc-800 shadow-md">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={isEnter}
              placeholder="Ask me anything..."
              className="w-full bg-transparent outline-none p-2 text-zinc-800 dark:text-white"
            />
            <button
              onClick={askQuestion}
              className="ml-3 px-4 py-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-2xl hover:opacity-90 transition"
            >
              Ask
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
