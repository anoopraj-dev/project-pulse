
const Footer = () => {
    return (
         <footer className="bg-[#0096C7]  text-gray-300 py-8 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1 */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Pulse360</h2>
            <p className="text-sm">
              A smarter way to manage your healthcare. Book appointments, access medical
              records, and connect with doctors anytime, anywhere.
            </p>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/about" className="hover:text-white">About</a></li>
              <li><a href="/services" className="hover:text-white">Services</a></li>
              <li><a href="/contact" className="hover:text-white">Contact</a></li>
              <li><a href="/faq" className="hover:text-white">FAQ</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Stay Connected</h3>
            <ul className="flex space-x-4 text-xl">
              <li><a href="#" aria-label="Facebook" className="hover:text-white">🌐</a></li>
              <li><a href="#" aria-label="Twitter" className="hover:text-white">🐦</a></li>
              <li><a href="#" aria-label="Instagram" className="hover:text-white">📸</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Pulse360. All rights reserved.
        </div>
      </div>
    </footer>
    )
}

export default Footer