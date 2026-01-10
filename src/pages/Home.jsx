import { Link } from 'react-router-dom';
import profileImg from "../assets/manoj-sharma.jpg";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-cream via-amber-50 to-orange-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Writer Info */}
            <div className="space-y-6 order-2 md:order-1">
              <h1 className="text-5xl md:text-6xl font-bold text-maroon leading-tight">
                डॉ. मनोज कुमार शर्मा
              </h1>
              <p className="text-2xl text-warmBrown font-medium">
                हिंदी साहित्यकार एवं लेखक
              </p>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border-l-4 border-saffron">
                <p className="text-lg text-gray-700 leading-relaxed italic">
                  "शब्दों में छिपी है वह शक्ति, जो मन को छू सके और जीवन को बदल सके। 
                  साहित्य केवल लेखन नहीं, बल्कि समाज के प्रति हमारी जिम्मेदारी है।"
                </p>
              </div>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed text-lg">
                  तीस वर्षों से हिंदी साहित्य की सेवा में संलग्न। लेख लेखन में विशेष रुचि। 
                  मेरा उद्देश्य है हिंदी भाषा और साहित्य को नई पीढ़ी तक पहुंचाना और उसे जीवित रखना।
                </p>
              </div>
              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  to="/articles"
                  className="bg-gradient-to-r from-maroon to-warmBrown text-white px-8 py-3 rounded-full font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  लेख पढ़ें 📚
                </Link>
              </div>
            </div>

            {/* Writer Image */}
            <div className="order-1 md:order-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-saffron/30 to-maroon/30 rounded-3xl blur-2xl"></div>
                <img
                  src={profileImg}
                  alt="डॉ. मनोज कुमार शर्मा"
                  className="relative rounded-3xl shadow-2xl w-full h-[500px] object-cover border-8 border-white"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

