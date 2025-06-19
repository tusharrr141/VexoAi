import React from "react";
import { FaGithub, FaLinkedin, FaUserCircle } from "react-icons/fa";
import { BackgroundBeamsWithCollision } from "./BackgroundBeamsWithCollision";

const AnimatedCard = ({
  inputValue,
  setInputValue,
  handleEnter,
  handleKeyDown,
}) => {
  return (
    <BackgroundBeamsWithCollision className="h-screen">
      <div className="bg-zinc-900 border border-zinc-700 shadow-xl p-8 rounded-3xl w-[26rem] text-center space-y-4 animate-fade-in backdrop-blur-sm bg-opacity-80 max-sm:mx-4">
        {/* Title */}
        <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          Welcome to Voxa
        </h2>

        {/* Tagline */}
        <p className="text-sm text-zinc-400 italic animate-pulse">
          Your smart companion for every question
        </p>

        {/* Input */}

        <input
          type="text"
          placeholder="Please enter your name to begin"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full p-2 mt-2 rounded-xl bg-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <button
          onClick={handleEnter}
          className="cursor-pointer mt-4 w-full py-2 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl hover:opacity-90 transition text-white font-semibold"
        >
          Enter
        </button>
      </div>

      {/* Footer Social Icons */}
      <div className="absolute bottom-12 mb-9 flex gap-12 text-white text-2xl">
        <a
          href="https://www.linkedin.com/in/tusharbairagi"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-pink-400 transition"
        >
          <FaLinkedin />
        </a>
        <a
          href="https://github.com/tusharrr141"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-pink-400 transition"
        >
          <FaGithub />
        </a>
        <a
          href="https://github.com/tusharrr141"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-pink-400 transition"
        >
          <FaUserCircle />
        </a>
      </div>
    </BackgroundBeamsWithCollision>
  );
};

export default AnimatedCard;
