import { useState } from "react";

const MY_COUNTRIES = [
  "Netherlands",
  "Belgium",
  "Poland",
  "Hungary",
  "Germany",
  "Luxembourg",
  "Italy",
  "Spain",
  "Switzerland",
  "Portugal",
  "Ukraine",
  "Slovakia",
  "Slovenia",
  "Egypt",
  "Turkey",
  "France",
  "Austria",
  "Serbia",
  "Albania",
  "Greece",
  "North Macedonia",
  "Bosnia and Herzegovina",
  "Kosovo",
  "Montenegro",
];

function SayPage() {
  const [selected1, setSelected1] = useState("");
  const [message1, setMessage1] = useState("");
  const [error1, setError1] = useState("");
  const [submitted1, setSubmitted1] = useState(false);

  const [name2, setName2] = useState("");
  const [message2, setMessage2] = useState("");
  const [error2, setError2] = useState("");
  const [submitted2, setSubmitted2] = useState(false);

  function handleSubmit1(e: React.FormEvent) {
    // Stops browser from reloading the page on submit
    e.preventDefault();
    if (message1.length < 10) {
      setError1("Please write at least 10 characters");
      return;
    }
    setError1("");
    setSubmitted1(true);
    setSelected1("");
    setMessage1("");
    setTimeout(() => setSubmitted1(false), 3000);
  }

  function handleSubmit2(e: React.FormEvent) {
    e.preventDefault();
    if (message2.length < 10) {
      setError2("Please write at least 10 characters");
      return;
    }
    setError2("");
    setSubmitted2(true);
    setName2("");
    setMessage2("");
    setTimeout(() => setSubmitted2(false), 3000);
  }

  return (
    <div className="max-w-2xl mx-auto py-4">
      <div className="mb-6">
        <p className="text-brand-pink text-sm uppercase tracking-widest font-medium mb-2">
          💬 share your thoughts
        </p>
        <h1 className="text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-brand to-brand-pink bg-clip-text text-transparent">
            Say something
          </span>
        </h1>
      </div>

      <div className="bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl p-8 mb-6">
        <h2 className="text-xl font-bold text-white mb-1">
          If you could live in one of my visited countries, which would it be?
        </h2>
        <p className="text-white/70 text-sm mb-6">I'm genuinely curious 🌍</p>

        {submitted1 ? (
          <p className="text-white font-medium">
            ✅ Survey submitted! Thank you 🌍
          </p>
        ) : (
          <form onSubmit={handleSubmit1} className="flex flex-col gap-4">
            <select
              value={selected1}
              onChange={(e) => setSelected1(e.target.value)}
              className="border border-white/30 rounded-xl px-4 py-3 text-sm focus:outline-none bg-white/20 text-white"
            >
              <option value="" className="text-gray-900">
                Pick a country...
              </option>
              {MY_COUNTRIES.map((country) => (
                <option key={country} value={country} className="text-gray-900">
                  {country}
                </option>
              ))}
            </select>

            <textarea
              value={message1}
              onChange={(e) => setMessage1(e.target.value)}
              placeholder="What draws you to it?"
              className="border border-white/30 rounded-xl px-4 py-3 text-sm focus:outline-none bg-white/20 text-white placeholder:text-white/60 h-28 resize-none"
            />

            {error1 && (
              <p className="text-white text-sm bg-white/20 rounded-lg px-3 py-2">
                {error1}
              </p>
            )}

            <button
              type="submit"
              className="bg-white text-brand rounded-xl px-6 py-3 text-sm font-bold hover:opacity-90 transition-opacity self-start"
            >
              Submit 🌍
            </button>
          </form>
        )}
      </div>

      <div className="bg-gradient-to-br from-pink-500 to-orange-400 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-white mb-1">
          Ask me anything ✉️
        </h2>
        <p className="text-white/70 text-sm mb-6">
          About travel, life, or anything in between
        </p>

        {submitted2 ? (
          <p className="text-white font-medium">
            ✉️ Message sent! I'll get back to you soon.
          </p>
        ) : (
          <form onSubmit={handleSubmit2} className="flex flex-col gap-4">
            <input
              value={name2}
              onChange={(e) => setName2(e.target.value)}
              placeholder="Your name (optional)"
              className="border border-white/30 rounded-xl px-4 py-3 text-sm focus:outline-none bg-white/20 text-white placeholder:text-white/60"
            />

            <textarea
              value={message2}
              onChange={(e) => setMessage2(e.target.value)}
              placeholder="Your question..."
              maxLength={500}
              className="border border-white/30 rounded-xl px-4 py-3 text-sm focus:outline-none bg-white/20 text-white placeholder:text-white/60 h-28 resize-none"
            />
            <p className="text-white/60 text-xs text-right">
              {message2.length} / 500
            </p>

            {error2 && (
              <p className="text-white text-sm bg-white/20 rounded-lg px-3 py-2">
                {error2}
              </p>
            )}

            <button
              type="submit"
              className="bg-white text-brand-pink rounded-xl px-6 py-3 text-sm font-bold hover:opacity-90 transition-opacity self-start"
            >
              Send ✉️
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default SayPage;
