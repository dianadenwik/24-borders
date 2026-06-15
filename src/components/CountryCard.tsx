import { Link } from "react-router";
import type { Country } from "../types";

// Defines what props this component expects to receive
interface Props {
  country: Country;
}

function CountryCard({ country }: Props) {
  // Extract values into variables to keep JSX clean
  const code = country.codes.alpha_2?.toLowerCase();
  const name = country.names.common;
  const capital = country.capitals?.[0]?.name;
  const flag = country.flag?.url_svg;
  // ?? = nullish coalescing: use fallback only if value is null or undefined
  const flagAlt = country.flag?.description ?? `Flag of ${name}`;

  return (
    // Link navigates without page reload
    <Link to={`/countries/${code}`} className="block group">
      <div className="bg-white rounded-2xl border border-orange-200 overflow-hidden hover:border-brand hover:shadow-lg transition-all duration-200">
        <img src={flag} alt={flagAlt} className="w-full h-36 object-cover" />
        <div className="p-4">
          <p className="font-semibold text-gray-900 mb-1 group-hover:text-brand transition-colors">
            {name}
          </p>
          <p className="text-sm text-gray-400 mb-3">{capital}</p>
          <span className="text-xs text-brand-pink bg-pink-50 border border-pink-100 rounded-full px-3 py-1">
            {country.region}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default CountryCard;
