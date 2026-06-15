import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import type { Country } from "../types";
import type { FetchState } from "../types";
import myNotes from "../data/myNotes";
import { fetchOptions, BASE_URL } from "../api";

const MY_COUNTRIES = [
  "nl",
  "be",
  "pl",
  "hu",
  "de",
  "lu",
  "it",
  "es",
  "ch",
  "pt",
  "ua",
  "sk",
  "si",
  "eg",
  "tr",
  "fr",
  "at",
  "rs",
  "al",
  "gr",
  "mk",
  "ba",
  "xk",
  "me",
];

function CountryDetailPage() {
  // Reads :code from URL
  const { code } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState<FetchState<Country>>({
    status: "loading",
  });

  useEffect(() => {
    // Lets us cancel the fetch if user leaves the page
    // Prevents memory leak and setState on unmounted component
    const controller = new AbortController();

    async function loadCountry() {
      try {
        setState({ status: "loading" });
        const res = await fetch(
          `${BASE_URL}/codes.alpha_2/${code?.toUpperCase()}?response_fields=names.common,names.official,capitals,region,subregion,population,flag.url_svg,flag.description,codes.alpha_2,codes.alpha_3,languages,currencies`,
          { ...fetchOptions, signal: controller.signal }, // spread: copies Authorization headers, connects to AbortController
        );
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const json = await res.json();
        // API returns an array even for one country
        setState({ status: "success", data: json.data.objects[0] });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setState({ status: "error", message: (err as Error).message });
        }
      }
    }

    loadCountry();
    // Cleanup: cancel fetch when component unmounts or code changes
    return () => controller.abort();
  }, [code]); // [code] = run again whenever code changes

  if (state.status === "loading") return <p>Loading...</p>;
  if (state.status === "error") return <p>Error: {state.message}</p>;

  const country = state.data;
  // "UA" → "ua" — lowercase to match MY_COUNTRIES and myNotes keys
  const alpha2 = country.codes?.alpha_2?.toLowerCase();
  const isVisited = MY_COUNTRIES.includes(alpha2);
  const note = myNotes[alpha2];
  const language = country.languages?.[0]?.name;
  // ?? {} — if currencies undefined → use empty object to avoid crash
  const currency = Object.values(country.currencies ?? {})[0];
  const capital = country.capitals?.[0]?.name;
  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-sm text-gray-500 hover:text-brand transition-colors flex items-center gap-1"
      >
        ← Back
      </button>

      <div className="bg-gradient-to-br from-brand via-brand-pink to-pink-700 rounded-2xl p-8 mb-6 text-white relative overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <img
            src={country.flag?.url_svg}
            alt={country.flag?.description ?? `Flag of ${country.names.common}`}
            className="w-36 h-24 object-cover rounded-xl shadow-lg"
          />
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold">{country.names.common}</h1>
              {/* Each card renders ONLY if its value exists */}
              {isVisited && (
                <span className="bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">
                  ♥ visited
                </span>
              )}
            </div>
            <p className="text-white/70 text-sm mb-4">
              {country.names.official}
            </p>
            <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
              {country.region}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {capital && (
          <div className="bg-white rounded-2xl border border-orange-100 p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
              Capital
            </p>
            <p className="font-semibold text-gray-900">{capital}</p>
          </div>
        )}
        {country.subregion && (
          <div className="bg-white rounded-2xl border border-orange-100 p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
              Subregion
            </p>
            <p className="font-semibold text-gray-900">{country.subregion}</p>
          </div>
        )}
        {country.population && (
          <div className="bg-white rounded-2xl border border-orange-100 p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
              Population
            </p>
            <p className="font-semibold text-gray-900">
              {country.population.toLocaleString()}
            </p>
          </div>
        )}
        {language && (
          <div className="bg-white rounded-2xl border border-orange-100 p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
              Language
            </p>
            <p className="font-semibold text-gray-900">{language}</p>
          </div>
        )}
        {currency && (
          <div className="bg-white rounded-2xl border border-orange-100 p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
              Currency
            </p>
            <p className="font-semibold text-gray-900">
              {currency.name} ({currency.symbol})
            </p>
          </div>
        )}
      </div>

      {note && (
        <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl border border-orange-100 p-8">
          <p className="text-brand-pink text-sm uppercase tracking-widest font-medium mb-3">
            ✈ my impression
          </p>
          <p className="text-gray-700 text-lg italic leading-relaxed">{note}</p>
        </div>
      )}
    </div>
  );
}

export default CountryDetailPage;
