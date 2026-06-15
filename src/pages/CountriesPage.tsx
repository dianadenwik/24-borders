import type { Country } from "../types";
import type { FetchState } from "../types";
import { useEffect, useState } from "react";
import CountryCard from "../components/CountryCard";
import { fetchOptions, BASE_URL } from "../api";

function CountriesPage() {
  const [sort, setSort] = useState("az");
  const [region, setRegion] = useState("all");
  const [search, setSearch] = useState("");
  const [state, setState] = useState<FetchState<Country[]>>({
    status: "loading",
  });

  useEffect(() => {
    const controller = new AbortController();

    async function loadCountries() {
      try {
        setState({ status: "loading" });
        // Extract fields string into a variable — cleaner than repeating in every fetch
        const fields =
          "names.common,flag.url_svg,flag.description,capitals,region,population,codes.alpha_2";

        const [r1, r2, r3] = await Promise.all([
          fetch(`${BASE_URL}?limit=100&offset=0&response_fields=${fields}`, {
            ...fetchOptions,
            signal: controller.signal,
          }),
          fetch(`${BASE_URL}?limit=100&offset=100&response_fields=${fields}`, {
            ...fetchOptions,
            signal: controller.signal,
          }),
          fetch(`${BASE_URL}?limit=100&offset=200&response_fields=${fields}`, {
            ...fetchOptions,
            signal: controller.signal,
          }),
        ]);
        // Check all three — if ANY failed throw error
        if (!r1.ok || !r2.ok || !r3.ok) throw new Error("HTTP error");
        // Parse all three JSON responses in parallel
        const [j1, j2, j3] = await Promise.all([
          r1.json(),
          r2.json(),
          r3.json(),
        ]);
        // Merge three arrays into one flat array of ~250 countries
        const data = [
          ...j1.data.objects,
          ...j2.data.objects,
          ...j3.data.objects,
        ];
        setState({ status: "success", data });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setState({ status: "error", message: (err as Error).message });
        }
      }
    }

    loadCountries();
    return () => controller.abort();
  }, []);// [] = run once on first render

  if (state.status === "loading") return <p>Loading countries...</p>;
  if (state.status === "error") return <p>Error: {state.message}</p>;

  const filtered = state.data
  // FILTER 1: search by name
    .filter(
      (country) =>
        search.length !== 1 &&
      // ?? "" — if names.common is undefined → use "" → country won't match
        (country.names?.common ?? "")
          .toLowerCase()
          .includes(search.toLowerCase()),
    )
    // FILTER 2: region
    .filter((country) => (region === "all" ? true : country.region === region))
     // SORT: by name or region
    .sort((a, b) => {
      if (sort === "az")
        return (a.names?.common ?? "").localeCompare(b.names?.common ?? "");
      if (sort === "za")
        return (b.names?.common ?? "").localeCompare(a.names?.common ?? "");
      return (a.region ?? "").localeCompare(b.region ?? "");
    });

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-1">
        All destinations
      </h1>
      <p className="text-gray-400 text-sm mb-6">
        {state.data.length} countries loaded
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search countries..."
          className="flex-1 border border-orange-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-orange-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand"
        >
          <option value="az">A → Z</option>
          <option value="za">Z → A</option>
          <option value="region">By region</option>
        </select>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="border border-orange-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand"
        >
          <option value="all">All regions</option>
          <option value="Africa">Africa</option>
          <option value="Americas">Americas</option>
          <option value="Asia">Asia</option>
          <option value="Europe">Europe</option>
          <option value="Oceania">Oceania</option>
        </select>
      </div>
{/* Show hint ONLY when search length is exactly 1 */}
      {search.length === 1 && (
        <p className="text-brand text-sm mb-4">
          Please enter at least 2 characters
        </p>
      )}
      {/* Show "no results" ONLY when: search > 1 char AND filtered is empty */}
      {search.length > 1 && filtered.length === 0 && (
        <p className="text-gray-400 text-sm mb-4">
          No countries match your search.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Render filtered and sorted cards */}
        {filtered.map((country) => (
          <CountryCard key={country.codes.alpha_2} country={country} />
        ))}
      </div>
    </div>
  );
}

export default CountriesPage;
