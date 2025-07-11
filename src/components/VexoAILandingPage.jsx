import React, { useState, useEffect, useRef, useCallback } from "react";

// Main App component for the landing page
// It now accepts an 'onNameSubmitted' prop to pass the user's name back to the parent.
const VexoAILandingPage = ({ onNameSubmitted }) => {
  // Renamed from App to VexoAILandingPage
  const [showNameInput, setShowNameInput] = useState(false); // State to control the visibility of the name input modal
  const [userName, setUserName] = useState(""); // State to store the user's name
  const [nameInputError, setNameInputError] = useState(""); // State for name input validation error
  const [isAnimating, setIsAnimating] = useState(false); // State to trigger initial animations for hero section
  const staticTagline =
    "Your intelligent companion for limitless conversations, powered by cutting-edge AI."; // Static tagline
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile navigation menu

  // Refs for observing new sections for animation
  const heroRef = useRef(null); // Added ref for the hero section
  const aboutRef = useRef(null);
  const whyVexoRef = useRef(null);
  const socialsRef = useRef(null);
  const canvasRef = useRef(null); // Ref for the canvas element

  // State to control animations for new sections
  const [aboutInView, setAboutInView] = useState(false);
  const [whyVexoInView, setWhyVexoInView] = useState(false);
  const [socialsInView, setSocialsInView] = useState(false);

  // Canvas animation logic
  const animateCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    // Set initial canvas dimensions
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();

    // Star properties (now static)
    const stars = [];
    const numStars = 250; // Increased number of static stars
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.2 + 0.3, // 0.3 to 1.5
        alpha: Math.random() * 0.7 + 0.3, // 0.3 to 1
      });
    }

    // Meteor properties
    const meteors = [];
    const maxMeteors = 10; // Increased number of meteors
    const meteorInterval = 1500; // milliseconds - faster appearance
    let lastMeteorTime = 0;

    class Meteor {
      constructor(canvasWidth, canvasHeight) {
        this.x = Math.random() * canvasWidth;
        this.y = -50; // Start above the canvas
        this.length = Math.random() * 60 + 20; // Smaller length: 20 to 80
        this.width = Math.random() * 2 + 1.5; // Slightly thicker: 1.5 to 3.5
        this.speed = Math.random() * 2 + 2; // Medium speed: 2 to 4
        this.angle =
          Math.PI / 4 + ((Math.random() * Math.PI) / 8 - Math.PI / 16); // Down-right angle with slight variation
        this.alpha = 1;
        this.fadeSpeed = 0.006; // Slightly slower fade for medium speed
        this.color = "white"; // Changed to white
      }

      update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.alpha -= this.fadeSpeed;
      }

      draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10; // Added shadow blur for glowing effect
        ctx.shadowColor = "rgba(255, 255, 255, 0.8)"; // White shadow for glowing effect
        ctx.beginPath();
        // Draw as a line for a more "beam" like effect
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
          this.x - Math.cos(this.angle) * this.length,
          this.y - Math.sin(this.angle) * this.length
        );
        ctx.lineWidth = this.width;
        ctx.strokeStyle = this.color;
        ctx.stroke();
        ctx.restore();
      }
    }

    const animate = (currentTime) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw static stars
      ctx.fillStyle = "white";
      stars.forEach((star) => {
        ctx.globalAlpha = star.alpha;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Add new meteors
      if (
        currentTime - lastMeteorTime > meteorInterval &&
        meteors.length < maxMeteors
      ) {
        meteors.push(new Meteor(canvas.width, canvas.height));
        lastMeteorTime = currentTime;
      }

      // Draw and update meteors
      for (let i = meteors.length - 1; i >= 0; i--) {
        const meteor = meteors[i];
        meteor.update();
        meteor.draw(ctx);

        // Remove meteors that are off-screen or faded
        if (
          meteor.alpha <= 0 ||
          meteor.y > canvas.height + meteor.length ||
          meteor.x > canvas.width + meteor.length
        ) {
          meteors.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // Start animation
    animationFrameId = requestAnimationFrame(animate);

    // Handle window resize
    window.addEventListener("resize", setCanvasSize);

    // Cleanup function
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", setCanvasSize);
    };
  }, []);

  // Effect to trigger initial animations on component mount and set up Intersection Observers
  useEffect(() => {
    setIsAnimating(true);
    animateCanvas(); // Start canvas animation

    const observerOptions = {
      root: null, // relative to the viewport
      rootMargin: "0px",
      threshold: 0.2, // 20% of the section must be visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === aboutRef.current) setAboutInView(true);
          if (entry.target === whyVexoRef.current) setWhyVexoInView(true);
          if (entry.target === socialsRef.current) setSocialsInView(true);
        }
      });
    }, observerOptions);

    // Observe the sections
    if (aboutRef.current) observer.observe(aboutRef.current);
    if (whyVexoRef.current) observer.observe(whyVexoRef.current);
    if (socialsRef.current) observer.observe(socialsRef.current);

    // Cleanup observer on unmount
    return () => {
      if (aboutRef.current) observer.unobserve(aboutRef.current);
      if (whyVexoRef.current) observer.unobserve(whyVexoRef.current);
      if (socialsRef.current) observer.unobserve(socialsRef.current);
    };
  }, [animateCanvas]); // Depend on animateCanvas to ensure it's stable

  // Function to handle clicking the "Start Convo" button
  const handleStartConvo = useCallback(() => {
    // Wrapped in useCallback
    setShowNameInput(true); // Show the name input modal
    setNameInputError(""); // Clear any previous errors
  }, []);

  // Function to handle submitting the user's name
  const handleNameSubmit = useCallback(() => {
    // Wrapped in useCallback
    if (userName.trim()) {
      // Call the prop function to pass the name back to the parent App component
      if (onNameSubmitted) {
        onNameSubmitted(userName.trim());
      }
      setShowNameInput(false); // Hide the modal after submission
    } else {
      setNameInputError("Please enter your name to start the conversation."); // Set error message
    }
  }, [userName, onNameSubmitted]);

  // Function to handle clicking the "Learn More" button
  const handleLearnMore = useCallback(() => {
    // Wrapped in useCallback
    // Smooth scroll to the "About VexoAI" section
    aboutRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Function to handle smooth scrolling to a ref
  const scrollToSection = useCallback((ref) => {
    // Wrapped in useCallback
    ref.current?.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false); // Close mobile menu after clicking a link
  }, []);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden font-inter text-white flex flex-col items-center p-4">
      {/* Canvas for star/meteor animation */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0"></canvas>

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-4 bg-transparent backdrop-filter backdrop-blur-lg shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo/Title */}
          <a
            href="#"
            onClick={() => scrollToSection(heroRef)}
            className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-blue-300"
          >
            VexoAI
          </a>
          {/* Nav Links (Desktop) */}
          <div className="hidden md:flex space-x-8">
            <button
              onClick={() => scrollToSection(heroRef)}
              className="text-gray-200 hover:text-white transition-colors duration-200 text-lg font-semibold cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection(aboutRef)}
              className="text-gray-200 hover:text-white transition-colors duration-200 text-lg font-semibold cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection(whyVexoRef)}
              className="text-gray-200 hover:text-white transition-colors duration-200 text-lg font-semibold cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection(socialsRef)}
              className="text-gray-200 hover:text-white transition-colors duration-200 text-lg font-semibold cursor-pointer"
            >
              Socials
            </button>
          </div>
          {/* Mobile Menu Button (Hamburger) */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-200 hover:text-white focus:outline-none"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile Nav Links */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-4 flex flex-col items-center">
            <button
              onClick={() => scrollToSection(heroRef)}
              className="text-gray-200 hover:text-white transition-colors duration-200 text-lg font-semibold w-full py-2 cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection(aboutRef)}
              className="text-gray-200 hover:text-white transition-colors duration-200 text-lg font-semibold w-full py-2 cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection(whyVexoRef)}
              className="text-gray-200 hover:text-white transition-colors duration-200 text-lg font-semibold w-full py-2 cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection(socialsRef)}
              className="text-gray-200 hover:text-white transition-colors duration-200 text-lg font-semibold w-full py-2 cursor-pointer"
            >
              Socials
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div
        ref={heroRef}
        className="relative z-10 flex flex-col items-center justify-center text-center max-w-5xl mx-auto p-6 pt-28 pb-12 bg-transparent backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl my-10"
      >
        {/* Project Title */}
        <h1
          className={`text-7xl md:text-9xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-blue-300 transition-all duration-1000 ${
            isAnimating
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-10"
          }`}
        >
          VexoAI
        </h1>

        {/* Tagline - now static */}
        <p
          className={`text-xl md:text-3xl mb-10 text-gray-200 leading-relaxed transition-all duration-1000 delay-300 ${
            isAnimating
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-5"
          }`}
        >
          {staticTagline}
        </p>

        {/* Feature Highlights */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full transition-all duration-1000 delay-600 ${
            isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <div className="p-5 bg-transparent rounded-xl shadow-lg flex flex-col items-center transform hover:scale-105 transition-transform duration-300 cursor-pointer">
            <svg
              className="w-10 h-10 mb-3 text-pink-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H2v-2a3 3 0 015.356-1.857M17 20v-2c0-.134-.01-.265-.029-.395m0 0A2.001 2.001 0 0018 10V8a2 2 0 00-2-2H8a2 2 0 00-2 2v2c0 .134.01.265.029.395M18 8a2 2 0 012 2v4.066M6 8a2 2 0 00-2 2v4.066M12 18h.01"
              ></path>
            </svg>
            <h3 className="text-xl font-semibold mb-2 text-purple-200">
              Multiple Characters
            </h3>
            <p className="text-gray-300 text-sm">
              Engage with diverse AI personalities.
            </p>
          </div>
          <div className="p-5 bg-transparent rounded-xl shadow-lg flex flex-col items-center transform hover:scale-105 transition-transform duration-300 cursor-pointer">
            <svg
              className="w-10 h-10 mb-3 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              ></path>
            </svg>
            <h3 className="text-xl font-semibold mb-2 text-violet-200">
              New Chat Functionality
            </h3>
            <p className="text-gray-300 text-sm">
              Start fresh conversations anytime.
            </p>
          </div>
          <div className="p-5 bg-transparent rounded-xl shadow-lg flex flex-col items-center transform hover:scale-105 transition-transform duration-300 cursor-pointer">
            <svg
              className="w-10 h-10 mb-3 text-violet-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              ></path>
            </svg>
            <h3 className="text-xl font-semibold mb-2 text-pink-200">
              History Saver
            </h3>
            <p className="text-gray-300 text-sm">
              Keep track of past interactions.
            </p>
          </div>
        </div>

        {/* Call to Action Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-900 ${
            isAnimating
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <button
            onClick={handleStartConvo}
            className="px-10 py-5 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-xl rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-opacity-75 animate-pulse cursor-pointer"
          >
            Start Convo
          </button>
          <button
            onClick={handleLearnMore}
            className="px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-lg rounded-full cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-opacity-75"
          >
            Learn More
          </button>
        </div>
      </div>

      {/* About VexoAI Section */}
      <section
        ref={aboutRef}
        className={`relative z-10 max-w-5xl mx-auto p-6 py-16 bg-transparent backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl my-10 transition-all duration-1000 ${
          aboutInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
        }`}
      >
        <h2 className="text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-violet-700 text-center">
          About VexoAI
        </h2>
        <p className="text-lg md:text-xl text-gray-200 mb-6 text-center leading-relaxed">
          VexoAI is designed to be your ultimate AI companion, offering a
          seamless and intuitive conversational experience. We leverage advanced
          AI models to provide intelligent, context-aware, and engaging
          interactions. Our mission is to make AI accessible and enjoyable for
          everyone, fostering creativity, learning, and connection.
        </p>
        <p className="text-lg md:text-xl text-gray-200 text-center leading-relaxed">
          Whether you're looking for a creative writing partner, a study
          assistant, or just a friendly chat, VexoAI adapts to your needs.
          Inspired by real AI platforms, VexoAI brings intelligent interactions
          to your fingertips for learning, fun, and exploration.
        </p>
      </section>

      {/* Why Choose VexoAI Section */}
      <section
        ref={whyVexoRef}
        className={`relative z-10 max-w-5xl mx-auto p-6 py-16 bg-transparent backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl my-10 transition-all duration-1000 ${
          whyVexoInView
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-20"
        }`}
      >
        <h2 className="text-5xl font-extrabold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-violet-700 text-center">
          Why Choose VexoAI?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-5 bg-transparent rounded-xl shadow-lg flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300 cursor-pointer">
            <svg
              className="w-12 h-12 mb-4 text-pink-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m1.636 6.364l.707-.707M6 10v3m0-3a2 2 0 110-4h.01M12 10v3m0-3a2 2 0 110-4h.01M18 10v3m0-3a2 2 0 110-4h.01M9 16v3m0-3a2 2 0 012-2h.01M15 16v3m0-3a2 2 0 012-2h.01"
              ></path>
            </svg>
            <h3 className="text-2xl font-semibold mb-3 text-purple-200">
              Intelligent & Adaptive
            </h3>
            <p className="text-gray-300 text-base">
              Our AI understands context and nuances, providing relevant and
              insightful responses tailored to your conversation.
            </p>
          </div>
          <div className="p-5 bg-transparent rounded-xl shadow-lg flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300 cursor-pointer">
            <svg
              className="w-12 h-12 mb-4 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              ></path>
            </svg>
            <h3 className="text-2xl font-semibold mb-3 text-violet-200">
              Blazing Fast Responses
            </h3>
            <p className="text-gray-300 text-base">
              Experience real-time conversations with minimal latency, keeping
              the flow natural and engaging.
            </p>
          </div>
          <div className="p-5 bg-transparent rounded-xl shadow-lg flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300 cursor-pointer">
            <svg
              className="w-12 h-12 mb-4 text-violet-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              ></path>
            </svg>
            <h3 className="text-2xl font-semibold mb-3 text-pink-200">
              Always Evolving
            </h3>
            <p className="text-gray-300 text-base">
              We are constantly improving VexoAI with new features, characters,
              and enhanced conversational abilities.
            </p>
          </div>
        </div>
      </section>

      {/* Socials Section */}
      <section
        ref={socialsRef}
        className={`relative z-10 max-w-5xl mx-auto p-6 py-16 bg-transparent backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl my-10 transition-all duration-1000 ${
          socialsInView
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-20"
        }`}
      >
        <h2 className="text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-violet-700 text-center">
          Connect with Us
        </h2>
        <p className="text-lg md:text-xl text-gray-200 mb-12 text-center leading-relaxed">
          Stay connected with the VexoAI community and explore more about our
          journey!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/tusharbairagi"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center p-5 rounded-xl bg-transparent shadow-lg transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 ease-in-out"
          >
            <svg
              className="w-14 h-14 mb-4 text-pink-400 group-hover:text-purple-400 transition-colors duration-300"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 6.499h-4.96v16.001h4.96v-16.001zm7.982 0h-4.96v16.001h4.96v-8.034c0-3.59 4.01-3.287 4.01-8.034v-.001h-4.01z" />
            </svg>
            <span className="text-xl font-semibold text-white group-hover:text-purple-200 transition-colors duration-300">
              LinkedIn
            </span>
            <p className="text-sm text-gray-300 mt-2">
              Professional connections & updates.
            </p>
          </a>
          {/* GitHub */}
          <a
            href="https://github.com/tusharrr141"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center p-5 rounded-xl bg-transparent shadow-lg transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 ease-in-out"
          >
            <svg
              className="w-14 h-14 mb-4 text-purple-400 group-hover:text-pink-400 transition-colors duration-300"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M12 0C5.373 0 0 5.373 0 12c0 5.303 3.438 9.799 8.205 11.385.6.11.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.334-1.756-1.334-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.838 1.237 1.838 1.237 1.07 1.835 2.809 1.305 3.49.998.108-.775.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.382 1.235-3.22-.12-.3-.53-1.52.12-3.18 0 0 1-.32 3.3-.12 1.02-.28 2.09-.42 3.16-.42.01 0 .02 0 .03 0 1.07.14 2.14.35 3.16.63 2.3-.2 3.3.12 3.3.12.65 1.66.24 2.88.12 3.18.77.838 1.235 1.91 1.235 3.22 0 4.61-2.805 5.62-5.475 5.92.43.37.82 1.1.82 2.22 0 1.606-.015 2.89-.015 3.28 0 .32.21.69.82.57C20.565 21.795 24 17.3 24 12c0-6.627-5.373-12-12-12z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xl font-semibold text-white group-hover:text-pink-200 transition-colors duration-300">
              GitHub
            </span>
            <p className="text-sm text-gray-300 mt-2">
              Explore our code & contributions.
            </p>
          </a>
          {/* Portfolio */}
          <a
            href="https://github.com/tusharrr141/Portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center p-5 rounded-xl bg-transparent shadow-lg transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 ease-in-out"
          >
            <svg
              className="w-14 h-14 mb-4 text-violet-400 group-hover:text-pink-400 transition-colors duration-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"></path>
              <path d="M9 13h6M9 17h6"></path>
            </svg>
            <span className="text-xl font-semibold text-white group-hover:text-violet-200 transition-colors duration-300">
              Portfolio
            </span>
            <p className="text-sm text-gray-300 mt-2">
              See more of our projects & work.
            </p>
          </a>
        </div>
      </section>

      {/* Name Input Modal */}
      {showNameInput && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center transform scale-95 opacity-0 animate-scaleIn">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              What's your name?
            </h2>
            <input
              type="text"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
                setNameInputError(""); // Clear error on change
              }}
              className="w-full p-4 mb-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleNameSubmit();
                }
              }}
            />
            {nameInputError && (
              <p className="text-red-500 text-sm mb-4">{nameInputError}</p>
            )}
            <button
              onClick={handleNameSubmit}
              className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-xl cursor-pointer rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-opacity-75"
            >
              Let's Chat!
            </button>
            <button
              onClick={() => setShowNameInput(false)}
              className="mt-4 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              No thanks
            </button>
          </div>
        </div>
      )}

      {/* Tailwind CSS CDN (for development, include in public/index.html for production) */}
      <script src="https://cdn.tailwindcss.com"></script>
      {/* Custom CSS for animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');

        .font-inter {
          font-family: 'Inter', sans-serif;
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(192, 38, 211, 0.7); /* purple-600 with opacity */
          }
          70% {
            box-shadow: 0 0 0 15px rgba(192, 38, 211, 0); /* purple-600 fading out */
          }
          100% {
            box-shadow: 0 0 0 0 rgba(192, 38, 211, 0);
          }
        }

        .animate-pulse {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default VexoAILandingPage;
