import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-12 bg-gradient-to-b from-orange-600 to-orange-800 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Left Section */}
          <div className="md:w-1/3">
            <div className="flex items-center mb-4">
              <span className="text-3xl font-bold text-white">
                MLA <span className="text-orange-300">Sethi</span>
              </span>
            </div>
            <p className="text-orange-100 mb-4">
              Serving the people with dedication and commitment to our cultural values.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-orange-700 hover:bg-orange-600 p-3 rounded-full transition-all duration-300">
                <Facebook size={18} />
              </a>
              <a href="#" className="bg-orange-700 hover:bg-orange-600 p-3 rounded-full transition-all duration-300">
                <Twitter size={18} />
              </a>
              <a href="#" className="bg-orange-700 hover:bg-orange-600 p-3 rounded-full transition-all duration-300">
                <Instagram size={18} />
              </a>
              <a href="#" className="bg-orange-700 hover:bg-orange-600 p-3 rounded-full transition-all duration-300">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Middle Sections */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:w-2/3">
            <div>
              <h4 className="text-lg font-bold mb-4 text-white border-b border-orange-500 pb-2">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-orange-100 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-orange-100 hover:text-white transition-colors">Initiatives</a></li>
                <li><a href="#" className="text-orange-100 hover:text-white transition-colors">Gallery</a></li>
                <li><a href="#" className="text-orange-100 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4 text-white border-b border-orange-500 pb-2">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-orange-100 hover:text-white transition-colors">News</a></li>
                <li><a href="#" className="text-orange-100 hover:text-white transition-colors">Events</a></li>
                <li><a href="#" className="text-orange-100 hover:text-white transition-colors">Downloads</a></li>
                <li><a href="#" className="text-orange-100 hover:text-white transition-colors">Media Kit</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4 text-white border-b border-orange-500 pb-2">Contact</h4>
              <ul className="space-y-3 text-orange-100">
                <li>MLA Office, City</li>
                <li>Email: contact@mlasethi.com</li>
                <li>Phone: 1800 20 90 920</li>
                <li>Emergency: 24/7 Helpline</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-orange-700 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-orange-200">© 2025 MLA Sethi. All Rights Reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-orange-200 hover:text-white">Privacy Policy</a>
            <a href="#" className="text-orange-200 hover:text-white">Terms of Service</a>
            <a href="#" className="text-orange-200 hover:text-white">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}