import { NavLink } from "react-router";

const navClass = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? "text-white bg-gradient-to-r from-brand to-brand-pink px-3 py-1.5 rounded-full text-xs font-semibold border border-brand transition-all text-center whitespace-nowrap"
    : "text-gray-500 px-3 py-1.5 rounded-full text-xs font-medium border border-orange-200 hover:bg-gradient-to-r hover:from-brand hover:to-brand-pink hover:text-white hover:border-brand transition-all text-center whitespace-nowrap";

function Navigation() {
  return (
    <nav className="flex gap-2 items-center">
      <NavLink to="/" end className={navClass}>
        Home
      </NavLink>
      <NavLink to="/countries" className={navClass}>
        Countries
      </NavLink>

      <NavLink to="/say" className={navClass}>
        Say
        <br />
        something
      </NavLink>
    </nav>
  );
}

export default Navigation;
