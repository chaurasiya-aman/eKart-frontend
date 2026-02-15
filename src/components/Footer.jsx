import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          
          {/* Brand */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">eKart</h2>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed">
              Your one-stop destination for premium products, best prices, and
              a smooth online shopping experience.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm ">
              <li><Link to="/" className="hover:text-sky-400">Home</Link></li>
              <li><Link to="/products" className="hover:text-sky-400">Products</Link></li>
              <li><Link to="/cart" className="hover:text-sky-400">Cart</Link></li>
              <li><Link to="/orders" className="hover:text-sky-400">Orders</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-4 ">
              Support
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/help" className="hover:text-sky-400">Help Center</Link></li>
              <li><Link to="/privacy" className="hover:text-sky-400">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-sky-400">Terms & Conditions</Link></li>
              <li><Link to="/contact" className="hover:text-sky-400">Contact Us</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 text-center">
              Follow Us
            </h3>
            <div className="flex items-center justify-center gap-4" >
              <a href="#" className="hover:text-sky-400">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-sky-400">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-sky-400">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-sky-400">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-5 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} eKart. All rights reserved.
      </div>
    </footer>
  );
};
