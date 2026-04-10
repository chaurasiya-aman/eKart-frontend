import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Zap } from "lucide-react";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section
      className="relative text-white overflow-hidden py-16 sm:py-20 md:py-28"
      style={{
        background:
          "radial-gradient(ellipse at bottom, #ff3cac 0%, #784ba0 40%, #2b0a3d 100%)",
      }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-pink-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-pink-200 text-xs font-medium px-3 py-1.5 rounded-full mb-5">
              <Zap className="w-3 h-3" />
              Flash Sale — Up to 50% Off
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-4">
              Latest Deals at
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-yellow-200">
                Best Prices
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-pink-100/80 mb-8 max-w-md mx-auto md:mx-0 leading-relaxed">
              Shop the latest smartphones, gadgets, and accessories at
              unbeatable prices — fast delivery, seamless experience.
            </p>

            <div className="flex gap-3 justify-center md:justify-start flex-wrap">
              <Button
                onClick={() => navigate("/products")}
                className="bg-white text-purple-800 hover:bg-pink-50 font-semibold px-6 py-2.5 rounded-xl shadow-lg cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Shop Now
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/products")}
                className="border-white/40 text-white hover:bg-white/10 bg-transparent font-medium px-6 py-2.5 rounded-xl cursor-pointer backdrop-blur-sm"
              >
                View Deals
              </Button>
            </div>

            <div className="mt-8 flex items-center gap-6 justify-center md:justify-start text-pink-200/70 text-xs sm:text-sm flex-wrap">
              <span>✓ Free Delivery</span>
              <span>✓ 7-Day Returns</span>
              <span>✓ Secure Payments</span>
            </div>
          </div>

          <div className="relative hidden md:flex justify-end items-center">
            <div className="absolute right-0 w-80 h-80 lg:w-96 lg:h-96 bg-pink-400/20 blur-3xl rounded-full" />
            <img
              src="/hero.png"
              alt="Hero Product"
              className="relative z-10 max-h-[360px] lg:max-h-[440px] w-auto object-contain drop-shadow-2xl scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
};