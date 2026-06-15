import type { Country } from "../types";
import type { FetchState } from "../types";
import { useEffect, useState } from "react";
import CountryCard from "../components/CountryCard";
import { fetchOptions, BASE_URL } from "../api";
import travelPhoto from "../assets/travel.jpg";

function HomePage() {
  // Tracks which country is selected in the <select> dropdown
  const [selected, setSelected] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  // false = show only 6 cards, true = show all 24
  const [showAll, setShowAll] = useState(false);

  // Fetch state
  const [state, setState] = useState<FetchState<Country[]>>({
    status: "loading",
  });

  useEffect(() => {
    // AbortController — lets us cancel the fetch request
    // Prevents memory leak if user leaves the page
    const controller = new AbortController();

    async function loadCountries() {
      try {
        setState({ status: "loading" });
        const [r1, r2, r3] = await Promise.all([
          fetch(
            `${BASE_URL}?limit=100&offset=0&response_fields=names.common,flag.url_svg,flag.description,capitals,region,population,codes.alpha_2`,
            { ...fetchOptions, signal: controller.signal },
            // ...fetchOptions = spread: copies Authorization headers into each fetch
            // signal — connects to AbortController for cancellation
          ),
          fetch(
            `${BASE_URL}?limit=100&offset=100&response_fields=names.common,flag.url_svg,flag.description,capitals,region,population,codes.alpha_2`,
            { ...fetchOptions, signal: controller.signal },
          ),
          fetch(
            `${BASE_URL}?limit=100&offset=200&response_fields=names.common,flag.url_svg,flag.description,capitals,region,population,codes.alpha_2`,
            { ...fetchOptions, signal: controller.signal },
          ),
        ]);
        if (!r1.ok || !r2.ok || !r3.ok) throw new Error("HTTP error");

        // Parse all three JSON responses in parallel
        const [j1, j2, j3] = await Promise.all([
          r1.json(),
          r2.json(),
          r3.json(),
        ]);
        const MY_CODES = [
          "NL",
          "BE",
          "PL",
          "HU",
          "DE",
          "LU",
          "IT",
          "ES",
          "CH",
          "PT",
          "UA",
          "SK",
          "SI",
          "EG",
          "TR",
          "FR",
          "AT",
          "RS",
          "AL",
          "GR",
          "MK",
          "BA",
          "XK",
          "ME",
        ];

        // Merge all three pages into one array
        const all = [
          ...j1.data.objects,
          ...j2.data.objects,
          ...j3.data.objects,
        ];

        // Filter: keep only countries whose alpha_2 code is in MY_CODES
        // .includes() — checks if MY_CODES array contains this code
        const mine = all.filter((c: Country) =>
          MY_CODES.includes(c.codes?.alpha_2?.toUpperCase()),
        );
        setState({ status: "success", data: mine });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setState({ status: "error", message: (err as Error).message });
        }
      }
    }

    loadCountries();
    // Cleanup function — runs when component unmounts
    // Cancels any unfinished fetch requests
    return () => controller.abort();
    // [] — empty dependency array = run this effect only ONCE
  }, []);

  if (state.status === "loading") return <p>Loading countries...</p>;
  if (state.status === "error") return <p>Error: {state.message}</p>;

  const visible = showAll ? state.data : state.data.slice(0, 6);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (message.length < 10) {
      setError("Please write at least 10 characters");
      return;
    }
    setError("");

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
    // Reset form fields back to empty
    setSelected("");
    setMessage("");
  }

  return (
    <div>
      <div
        className="rounded-2xl p-10 mb-10 text-white relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,95,31,0.85), rgba(232,24,93,0.7)), url(${travelPhoto})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <p className="text-sm uppercase tracking-widest text-white/70 mb-4">
          Personal travel diary
        </p>
        <h1 className="text-5xl font-bold leading-tight mb-4 drop-shadow-lg">
          24 countries.
          <br />
          Endless stories.
        </h1>
        <p className="text-white/90 text-base leading-relaxed max-w-lg mb-8 drop-shadow-md">
          I'm Diana, currently based in the Netherlands. I just love discovering
          new places. This page is my little collection of countries I've been
          to — the memories, and a few personal notes along the way.
        </p>

        <div className="flex gap-10 mt-2">
          <div>
            <p className="text-4xl font-bold drop-shadow-lg">24</p>
            <p className="text-gray/100 text-sm uppercase tracking-wide drop-shadow-md">
              countries visited
            </p>
          </div>
          <div>
            <p className="text-4xl font-bold drop-shadow-lg">3</p>
            <p className="text-gray/100 text-sm uppercase tracking-wide drop-shadow-md">
              regions explored
            </p>
          </div>
          <div>
            <p className="text-4xl font-bold drop-shadow-lg">22</p>
            <p className="text-gray/100 text-sm uppercase tracking-wide drop-shadow-md">
              in Europe alone
            </p>
          </div>
        </div>
      </div>
      <div className="mb-8 mt-10">
        <p className="text-brand-pink text-sm uppercase tracking-widest font-medium mb-2">
          ✈ my journey
        </p>
        <h2 className="text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-brand to-brand-pink bg-clip-text text-transparent">
            Places I've been
          </span>
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed italic mb-6">
          Crystal water in Greece. Snow on Swiss peaks. Sand dunes outside
          Cairo. The world is unreasonably beautiful — I have proof 🌍
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* .map() — loops over array, returns one <CountryCard> per country */}
        {visible.map((country) => (
          <CountryCard key={country.codes.alpha_2} country={country} />
        ))}
      </div>

      <div className="flex justify-center mb-12">
        <button
          onClick={() => setShowAll(!showAll)}
          className="border border-brand text-brand rounded-xl px-8 py-3 text-sm font-medium hover:bg-brand hover:text-white transition-all"
        >
          {/* Ternary: if showAll is true → "Show less", else → "Show all 24" */}
          {showAll ? "Show less ↑" : "Show all 24 ↓"}
        </button>
      </div>
      <div className="my-12 max-w-6xl">
        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed italic mb-6">
          Nobody warns you that visiting one country just adds{" "}
          <span className="text-brand font-semibold not-italic">
            five more to the list.
          </span>{" "}
          You book one flight thinking it's a one-time thing — and never quite
          stop.
        </p>

        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed italic mb-6">
          The map keeps growing. So does the wish list. And somewhere along the
          way, the wish list stops feeling overwhelming and starts feeling like{" "}
          <span className="text-brand font-semibold not-italic">
            a promise you made to yourself.
          </span>
        </p>
        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed italic mb-6">
          Nobody tells you about the small things either. The way a city smells
          in the morning before the tourists wake up. The kindness of strangers
          who don't share your language but somehow understand exactly what you
          need. The moment you realize{" "}
          <span className="text-brand-pink font-semibold not-italic">
            you've stopped translating in your head.
          </span>
        </p>
        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed italic mb-6">
          Every border crossing is a small leap of faith. You don't know what's
          on the other side — and that's exactly the point. The best souvenir
          you can bring home isn't something you buy. It's{" "}
          <span className="text-brand font-semibold not-italic">
            a slightly different way of seeing things.
          </span>{" "}
          A little more patience. A little less certainty that your way is the
          only way.
        </p>
      </div>
      <div className="bg-gradient-to-br from-pink-500 to-orange-400 rounded-2xl p-8 border border-orange-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Which of my destinations would you visit first? 🌍
        </h2>
        <p className="text-pink-900 text-bold mb-6 text-xl">
          Tell me your pick — I'd love to know
        </p>
        {/* Conditional render: submitted=true → thank you, false → form */}
        {submitted ? (
          <p className="text-gray-600 font-medium">
            Thanks for sharing! Your answer made my day. 🌍
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="border border-orange-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand"
            >
              <option value="">Pick a country...</option>
              {state.data.map((country) => (
                <option
                  key={country.codes.alpha_2}
                  value={country.names.common}
                >
                  {country.names.common}
                </option>
              ))}
            </select>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell me why..."
              className="border border-orange-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand h-28 resize-none"
            />

            {error && <p className="text-gray-600 text-sm">{error}</p>}

            <button
              type="submit"
              className="bg-gradient-to-r from-brand to-brand-pink text-white rounded-xl px-6 py-3 text-sm font-medium hover:opacity-90 transition-opacity self-start"
            >
              Send ✈
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default HomePage;
