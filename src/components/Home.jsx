import { useCallback, useEffect, useRef, useState } from "react";
import { URL } from "../constants";
import RecentSearch from "./RecentSearch";
import QuestionAnswer from "./QuestionAnswer";
import ThemeSelector from "./ThemeSelector";
import { Menu, MessageCircleDashed, MessageSquareText } from "lucide-react";
import { characterPrompts } from "../../data/data";

function Home({ name, darkMode, setDarkMode }) {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState([]);
  const [recentHistory, setRecentHistory] = useState(
    JSON.parse(localStorage.getItem("history")) || []
  );
  const [selectedHistory, setSelectedHistory] = useState("");
  const [loader, setLoader] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [character, setCharacter] = useState("neutral");

  const containerRef = useRef(null);
  const lastQuestionRef = useRef(null);

  const handleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode === "dark");
  }, [darkMode]);

  const askQuestion = useCallback(async () => {
    // MAIN Function to ask a question
    if (!question && !selectedHistory) return;

    const query = question || selectedHistory;
    //const astroQuery = query;

    //console.log(astroQuery);
    const finalPrompt = `
    ${characterPrompts[character].prompt}

     User's Question: ${question || selectedHistory}
   `;

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
      contents: [{ parts: [{ text: finalPrompt }] }],
    };

    setLoader(true);
    let response = await fetch(URL, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    response = await response.json();

    let dataString = response.candidates[0].content.parts[0].text;

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
  }, [question, selectedHistory, setRecentHistory]);

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
  }, [selectedHistory, askQuestion]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-5 h-full custom-scrollbar bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white z-10">
        {/* Sidebar */}
        <div
          className={`lg:col-span-1 border-r border-zinc-700 dark:border-zinc-600 w-full h-screen ${
            isMenuOpen ? " " : "max-md:hidden"
          }`}
        >
          <RecentSearch
            recentHistory={recentHistory}
            setRecentHistory={setRecentHistory}
            setSelectedHistory={setSelectedHistory}
            selectedHistory={selectedHistory}
            setResult={setResult}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
          />
        </div>

        {/* Main Content */}
        <div className="md:col-span-4 p-4 md:p-6 flex flex-col h-screen overflow-hidden relative">
          {/* Header Row */}
          <div className="w-full relative mb-2 flex justify-center md:mb-4 ">
            {/* Greeting always centered */}
            <h1 className="absolute top-1/2 -translate-y-1/2 text-base sm:text-2xl font-semibold text-zinc-500 text-center max-md:hidden">
              Hello <span className="text-pink-500 font-bold">{name}</span> 👋
            </h1>

            {/* Inline on desktop */}
            <div className="flex justify-between items-center w-full flex-row">
              {/* recent history */}
              <div className="flex items-center justify-center ">
                <Menu onClick={handleMenu} className="size-5 md:hidden" />
              </div>

              {/* name of user */}
              <div className="flex items-center justify-center ">
                {result.length > 0 && (
                  <h1 className="md:hidden text-base sm:text-2xl font-semibold text-zinc-500 text-center">
                    Hello{" "}
                    <span className="text-pink-500 font-bold">{name}</span> 👋
                  </h1>
                )}
              </div>

              <div className="flex items-end space-x-3">
                {/* character selection */}
                <div className=" w-32  flex items-center justify-center">
                  <select
                    className="w-full p-2 rounded-xl border dark:bg-zinc-800 dark:text-white"
                    value={character}
                    onChange={(e) => setCharacter(e.target.value)}
                  >
                    {Object.entries(characterPrompts).map(
                      (
                        [key, val] //This converts the object into an array of key-value pairs.
                      ) => (
                        <option key={key} value={key}>
                          {val.label}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* new chat */}
                <div className="dark:bg-zinc-600 bg-zinc-100 p-2 rounded-xl flex items-center justify-center">
                  <MessageSquareText
                    className="size-5 cursor-pointer flex items-center justify-center text-purple-600/70 dark:text-purple-600"
                    onClick={() => {
                      setResult([]);
                      setSelectedHistory("");
                      setQuestion("");
                    }}
                  />
                </div>
                {/* dark or light mode */}
                <ThemeSelector darkMode={darkMode} setDarkMode={setDarkMode} />
              </div>
            </div>
          </div>

          {result.length === 0 && (
            <div className="hidden h-full max-md:flex flex-col space-y-4 items-center justify-center">
              <h1 className="text-base sm:text-2xl font-semibold text-zinc-500 text-center">
                Hello <span className="text-pink-500 font-bold">{name}</span> 👋
              </h1>
              <h2 className=" text-3xl sm:text-4xl max-md: mb-2 pb-1 text-center font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-violet-700">
                Ask me Anything
              </h2>
            </div>
          )}

          {/* Main Heading */}
          <h2 className="max-md:hidden text-3xl sm:text-4xl max-md: mb-2 pb-1 text-center font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-violet-700">
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
            className="flex-1 custom-scrollbar pr-2 sm:pr-4 dark:text-zinc-300 text-zinc-800 space-y-3 overflow-y-auto"
          >
            {result.map((item, index) => {
              const isLatestQuestion =
                item.type === "q" && index === result.length - 2;
              return (
                <div
                  key={index}
                  ref={isLatestQuestion ? lastQuestionRef : null}
                >
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
    </>
  );
}

export default Home;
