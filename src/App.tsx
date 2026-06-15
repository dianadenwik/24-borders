import { Routes, Route } from "react-router";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import CountriesPage from "./pages/CountriesPage";
import CountryDetailPage from "./pages/CountryDetailPage";
import SayPage from "./pages/SayPage";
import NotFoundPage from "./pages/NotFoundPage";
import Header from "./components/Header";

function App() {
  return (
    <div className="min-h-screen bg-[#fff9f5] text-gray-900 dark:bg-[#21132f] dark:text-gray-100 flex flex-col">
      <Header />
      <main className=" w-full max-w-6xl mx-auto px-4 py-8 flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/countries" element={<CountriesPage />} />
          <Route path="/countries/:code" element={<CountryDetailPage />} />
          <Route path="/say" element={<SayPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
