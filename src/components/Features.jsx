import { Truck, ShieldCheck, Headphones, CreditCard } from "lucide-react";

const features = [
  {
    icon: <Truck className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "Fast Delivery",
    description: "Quick and reliable shipping to get your products delivered on time.",
    gradient: "from-orange-400 to-rose-500",
    bg: "bg-orange-50",
  },
  {
    icon: <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "Secure Payments",
    description: "Your transactions are protected with industry-grade security.",
    gradient: "from-emerald-400 to-green-600",
    bg: "bg-emerald-50",
  },
  {
    icon: <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "Easy Payments",
    description: "Multiple options including cards, UPI, and wallets.",
    gradient: "from-blue-400 to-indigo-600",
    bg: "bg-blue-50",
  },
  {
    icon: <Headphones className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "24/7 Support",
    description: "Our support team is always available to help you anytime.",
    gradient: "from-purple-400 to-violet-600",
    bg: "bg-purple-50",
  },
];

export const Features = () => {
  return (
    <section className="py-14 sm:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Why eKart
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mt-4 tracking-tight">
            Shop Smarter with eKart
          </h2>
          <p className="mt-3 text-gray-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Experience seamless shopping with trusted quality, secure payments,
            and fast delivery — every single time.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className={`${f.bg} rounded-2xl p-5 sm:p-6 border border-white shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group`}
            >
              <div className={`w-11 h-11 sm:w-13 sm:h-13 rounded-xl bg-gradient-to-br ${f.gradient} text-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                {f.icon}
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1.5">
                {f.title}
              </h3>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};