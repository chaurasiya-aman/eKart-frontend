import { Truck, ShieldCheck, Headphones, CreditCard } from "lucide-react";

export const Features = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Why Shop with eKart?
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Experience seamless shopping with trusted quality, secure payments,
            and fast delivery.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          
          <FeatureCard
            icon={<Truck />}
            title="Fast Delivery"
            description="Quick and reliable shipping to get your products delivered on time."
          />

          <FeatureCard
            icon={<ShieldCheck />}
            title="Secure Payments"
            description="Your transactions are protected with industry-grade security."
          />

          <FeatureCard
            icon={<CreditCard />}
            title="Easy Payments"
            description="Multiple payment options including cards, UPI, and wallets."
          />

          <FeatureCard
            icon={<Headphones />}
            title="24/7 Support"
            description="Our support team is always available to help you anytime."
          />

        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="rounded-2xl p-6 text-center border border-gray-200 hover:shadow-lg transition">
      
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-purple-600 text-white">
        {icon}
      </div>

      <h3 className="text-lg font-semibold text-gray-900">
        {title}
      </h3>

      <p className="mt-2 text-gray-600 text-sm">
        {description}
      </p>
    </div>
  );
};
