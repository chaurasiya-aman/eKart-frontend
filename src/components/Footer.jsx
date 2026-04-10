import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Linkedin, ShoppingCart, Mail, Phone } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-10 sm:mb-12">

          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-white p-1.5 rounded-lg">
                <ShoppingCart className="h-4 w-4 text-gray-900" />
              </div>
              <span className="text-white font-bold text-xl italic font-[cursive]">eKart</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-4 max-w-xs">
              Your one-stop destination for premium products, best prices, and
              a smooth online shopping experience.
            </p>
            <div className="flex flex-col gap-2 text-xs text-gray-500">
              <span className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" /> ekartsupports@gmail.com
              </span>
              <span className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5" /> +91 98765 43210
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-white mb-4 uppercase tracking-widest">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {[
                { to: "/", label: "Home" },
                { to: "/products", label: "Products" },
                { to: "/cart", label: "Cart" },
                { to: "/orders", label: "Orders" },
              ].map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className="hover:text-white transition-colors hover:translate-x-0.5 inline-block">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-white mb-4 uppercase tracking-widest">
              Support
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {[
                { to: "/help", label: "Help Center" },
                { to: "/privacy", label: "Privacy Policy" },
                { to: "/terms", label: "Terms & Conditions" },
                { to: "/contact", label: "Contact Us" },
              ].map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className="hover:text-white transition-colors hover:translate-x-0.5 inline-block">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-white mb-4 uppercase tracking-widest">
              Follow Us
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-white hover:text-gray-900 text-gray-400 flex items-center justify-center transition-all duration-200"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
            <p className="mt-5 text-xs text-gray-600 leading-relaxed">
              Stay connected for exclusive deals and latest updates.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <span>© {new Date().getFullYear()} eKart. All rights reserved.</span>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-gray-400 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-gray-400 transition-colors">Terms</Link>
            <Link to="/contact" className="hover:text-gray-400 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};