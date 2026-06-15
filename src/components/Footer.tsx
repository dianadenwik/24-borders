function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-orange-100 py-8">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
        <span className="text-sm font-semibold bg-gradient-to-r from-brand to-brand-pink bg-clip-text text-transparent">
          ✈ 24 Borders
        </span>
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed italic mb-6">© {year} Diana Chukhrai · Built with React & Tailwind</p>
      </div>
    </footer>
  );
}

export default Footer;