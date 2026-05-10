import React from "react";
import { Link } from "react-router-dom";

export function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-violet-50">
      {/* Header/Navigation */}
      <header className="sticky top-0 bg-white bg-opacity-95 backdrop-blur-sm border-b border-slate-200 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Hyperlocal Market
          </div>
          <Link
            to="/login"
            className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
          >
            Login
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Connect with <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Local Shops</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Discover local businesses near you, explore products from small shop owners, and support your community while shopping locally.
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Link
            to="/login"
            className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold text-lg"
          >
            Get Started
          </Link>
          <button className="border-2 border-slate-300 text-slate-700 px-8 py-3 rounded-lg hover:bg-slate-50 transition-all duration-300 font-semibold text-lg">
            Learn More
          </button>
        </div>
      </section>

      {/* What is Hyperlocal Market */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            What is Hyperlocal Market?
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            Hyperlocal Market is a digital platform that bridges the gap between local shop owners and customers. 
            We empower small businesses by giving them a digital storefront to showcase their products to a wider audience 
            while helping customers discover quality local products and shops in their area. Our mission is to foster 
            community commerce and support small-scale entrepreneurs in the digital age.
          </p>
        </div>
      </section>

      {/* Purpose Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
          Our Purpose
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="text-4xl mb-4">🏪</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Support Small Businesses</h3>
            <p className="text-slate-600">
              Empower local shop owners by providing them a digital platform to reach more customers and grow their business.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Easy Discovery</h3>
            <p className="text-slate-600">
              Help customers find amazing local shops and products near them with intuitive search and filtering options.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Build Community</h3>
            <p className="text-slate-600">
              Foster meaningful connections between buyers and sellers through chat, reviews, and local engagement.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* For Customers */}
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-indigo-900 mb-6">For Customers</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="text-2xl font-bold text-indigo-600 min-w-fit">1.</div>
                <div>
                  <h4 className="font-bold text-slate-900">Sign Up / Login</h4>
                  <p className="text-slate-700 text-sm">Create your account or login to access local shops</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl font-bold text-indigo-600 min-w-fit">2.</div>
                <div>
                  <h4 className="font-bold text-slate-900">Search & Browse</h4>
                  <p className="text-slate-700 text-sm">Discover local shops and products near your location</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl font-bold text-indigo-600 min-w-fit">3.</div>
                <div>
                  <h4 className="font-bold text-slate-900">View Details</h4>
                  <p className="text-slate-700 text-sm">Check products, reviews, and shop information</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl font-bold text-indigo-600 min-w-fit">4.</div>
                <div>
                  <h4 className="font-bold text-slate-900">Connect & Chat</h4>
                  <p className="text-slate-700 text-sm">Message sellers directly for inquiries and support</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl font-bold text-indigo-600 min-w-fit">5.</div>
                <div>
                  <h4 className="font-bold text-slate-900">Rate & Review</h4>
                  <p className="text-slate-700 text-sm">Share your experience by leaving reviews and ratings</p>
                </div>
              </div>
            </div>
          </div>

          {/* For Sellers */}
          <div className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-violet-900 mb-6">For Sellers</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="text-2xl font-bold text-violet-600 min-w-fit">1.</div>
                <div>
                  <h4 className="font-bold text-slate-900">Register as Seller</h4>
                  <p className="text-slate-700 text-sm">Create your seller account and set up your shop</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl font-bold text-violet-600 min-w-fit">2.</div>
                <div>
                  <h4 className="font-bold text-slate-900">Add Products</h4>
                  <p className="text-slate-700 text-sm">Upload your products with details and images</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl font-bold text-violet-600 min-w-fit">3.</div>
                <div>
                  <h4 className="font-bold text-slate-900">Manage Dashboard</h4>
                  <p className="text-slate-700 text-sm">Track orders and manage your inventory</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl font-bold text-violet-600 min-w-fit">4.</div>
                <div>
                  <h4 className="font-bold text-slate-900">Respond to Queries</h4>
                  <p className="text-slate-700 text-sm">Chat with customers and answer their questions</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl font-bold text-violet-600 min-w-fit">5.</div>
                <div>
                  <h4 className="font-bold text-slate-900">Grow Your Business</h4>
                  <p className="text-slate-700 text-sm">Reach more customers and expand your sales</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: "🗺️", title: "Location-based Search", desc: "Find shops and products near you with GPS integration" },
            { icon: "💬", title: "Real-time Chat", desc: "Connect with sellers instantly for product inquiries" },
            { icon: "⭐", title: "Ratings & Reviews", desc: "Make informed decisions based on customer feedback" },
            { icon: "❤️", title: "Favorites", desc: "Save your favorite shops and products for quick access" },
            { icon: "📊", title: "Analytics", desc: "Sellers can track performance and customer insights" },
            { icon: "🔐", title: "Secure Platform", desc: "Safe and secure transactions with verified sellers" },
          ].map((feature, idx) => (
            <div key={idx} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
          Why Choose Hyperlocal Market?
        </h2>
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl text-white p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">✓ Support Local Community</h3>
              <p className="mb-6">Every purchase supports local entrepreneurs and keeps money in your community.</p>

              <h3 className="text-xl font-bold mb-4">✓ Direct Connection</h3>
              <p>Talk directly with shop owners and get personalized recommendations.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">✓ Discover Hidden Gems</h3>
              <p className="mb-6">Find unique, quality products from small businesses you might never have discovered.</p>

              <h3 className="text-xl font-bold mb-4">✓ Authentic & Trustworthy</h3>
              <p>Real reviews and verified sellers ensure you're getting genuine products and services.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            Ready to Explore Local Shops?
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Join thousands of customers and sellers on Hyperlocal Market today.
          </p>
          <Link
            to="/login"
            className="inline-block bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-10 py-4 rounded-lg hover:shadow-lg transition-all duration-300 font-bold text-lg"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 mt-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">Hyperlocal Market</h4>
              <p className="text-slate-400 text-sm">
                Connecting local shops with customers in your community.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">For Customers</h4>
              <ul className="text-slate-400 text-sm space-y-2">
                <li><a href="#" className="hover:text-white transition">Browse Shops</a></li>
                <li><a href="#" className="hover:text-white transition">Search Products</a></li>
                <li><a href="#" className="hover:text-white transition">Reviews</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">For Sellers</h4>
              <ul className="text-slate-400 text-sm space-y-2">
                <li><a href="#" className="hover:text-white transition">Become a Seller</a></li>
                <li><a href="#" className="hover:text-white transition">Dashboard</a></li>
                <li><a href="#" className="hover:text-white transition">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="text-slate-400 text-sm space-y-2">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-slate-400 text-sm">
            <p>&copy; 2024 Hyperlocal Market. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
