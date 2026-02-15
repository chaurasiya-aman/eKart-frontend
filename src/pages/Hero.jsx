import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <section
      className="relative text-white py-20 overflow-hidden"
      style={{
        background: `
          radial-gradient(
            circle at bottom,
            #ff3cac 0%,
            #784ba0 45%,
            #2b0a3d 100%
          )
        `,
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Latest Deals at Best Prices
            </h1>

            <p className="text-xl mb-6 text-pink-100">
              Shop the latest smartphones, gadgets, and accessories at
              unbeatable prices. eKart brings you premium quality products, fast
              delivery, and a seamless shopping experience.
            </p>

            <div className="flex gap-4">
              <Button className="bg-white text-purple-700 hover:bg-gray-100 cursor-pointer">
                Shop Now
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-purple-700 bg-transparent cursor-pointer"
              >
                View Deals
              </Button>
            </div>
          </div>

          <div className="relative hidden md:flex justify-end items-center">
            <div className="absolute right-10 w-80 h-80 bg-pink-500/30 blur-3xl rounded-full"></div>

            <img
              src="/hero.png"
              alt="Hero Product"
              className="
                relative
                max-h-[420px]
                object-contain
                scale-105
               
              "
              style={{ borderRadius: "2em" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
