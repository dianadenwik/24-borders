import { Link } from "react-router";

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <p className="text-8xl mb-4">✈️</p>
      <h1 className="text-6xl font-bold bg-gradient-to-r from-brand to-brand-pink bg-clip-text text-transparent mb-4">
        404
      </h1>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Lost in transit</h2>
      <p className="text-gray-400 mb-8">This page doesn't exist — but 24 countries do.</p>
      <Link
        to="/"
        className="bg-gradient-to-r from-brand to-brand-pink text-white rounded-xl px-8 py-3 text-sm font-medium hover:opacity-90 transition-opacity"
      >
        ← Take me home
      </Link>
    </div>
  );
}

export default NotFoundPage;