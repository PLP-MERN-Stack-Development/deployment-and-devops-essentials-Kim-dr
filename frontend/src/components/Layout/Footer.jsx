const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <p className="text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} MERN Todo App. Built with React, Node.js, Express & MongoDB.
        </p>
      </div>
    </footer>
  );
};

export default Footer;