import { useState } from "react";
import Navigation from "./Navigation";

function Header() {
  const [dark, setDark] = useState(false);
  function toggle() {
    setDark(!dark);
    document.documentElement.classList.toggle("dark");
  }
  return (
    <header className="bg-white dark:bg-[#221535] border-b border-orange-100 dark:border-purple-900 sticky top-0 z-50 w-full overflow-hidden">
      <div className="max-w-6xl mx-auto px-3 py-3 flex justify-between items-center gap-1">
        <span className="text-base font-semibold bg-gradient-to-r from-brand to-brand-pink bg-clip-text text-transparent whitespace-nowrap">
          ✈ 24 Borders
        </span>
        <div className="flex-1 flex justify-center">
          <Navigation />
        </div>
        <button
          onClick={toggle}
          aria-label="Toggle dark mode"
          className="w-8 h-8 min-w-[32px] flex-shrink-0 rounded-full text-sm border-2 border-orange-300 bg-orange-50 text-gray-600 hover:border-brand hover:text-brand transition-colors focus:outline-none"
        >
          {dark ? "☀️" : "🌙"}
        </button>
      </div>
    </header>
  );
}

export default Header;
