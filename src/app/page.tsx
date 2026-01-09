import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/Footer';
import { GradientLink } from '@/components/ui/GradientButton';
import { MapPin, Calendar, Shield, TrendingUp, Users, Globe2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white"> 
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1E3A8A] via-[#1E40AF] to-[#0EA5A4] overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgMi4yMS0xLjc5IDQtNCA0cy00LTEuNzktNC00IDEuNzktNCA0LTQgNCAxLjc5IDQgNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Plan Smarter.<br />Travel Better.
              </h1>
              <p className="text-lg sm:text-xl text-blue-100 mb-10 leading-relaxed max-w-2xl">
                Transform the way you plan trips. Organize itineraries, track expenses, 
                and discover destinations—all in one intuitive platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <GradientLink
                  variant="cta"
                  size="lg"
                  href="/signUp"
                >
                  Get Started Free
                </GradientLink>
                <GradientLink
                  variant="ghost"
                  size="lg"
                  href="/dashboard"
                >
                  View Demo
                </GradientLink>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mt-20 pt-12 border-t border-white/20">
                <div>
                  <div className="text-3xl font-bold text-white mb-1">10K+</div>
                  <div className="text-sm text-blue-100">Active Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">50K+</div>
                  <div className="text-sm text-blue-100">Trips Planned</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">120+</div>
                  <div className="text-sm text-blue-100">Countries</div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-full min-h-[500px]">
                <Image
                  src="/images/homePage/HeroImage.png"
                  alt="World map with travel routes and destinations"
                  width={800}
                  height={400}
                  className="object-contain rounded-2xl shadow-sm drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-28 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-4">
              Everything you need for seamless travel planning
            </h2>
            <p className="text-lg text-[#475569]">
              Built for travelers who want control, clarity, and convenience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl border border-[#E5E7EB] hover:border-[#1E3A8A] transition-all duration-200 group">
              <div className="w-12 h-12 bg-[#1E3A8A]/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#1E3A8A] transition-colors">
                <Calendar className="w-6 h-6 text-[#1E3A8A] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-[#0F172A] mb-3">
                Day-by-Day Itineraries
              </h3>
              <p className="text-[#475569] leading-relaxed">
                Build detailed schedules with activities, locations, and notes. Keep everything organized in one place.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl border border-[#E5E7EB] hover:border-[#0EA5A4] transition-all duration-200 group">
              <div className="w-12 h-12 bg-[#0EA5A4]/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#0EA5A4] transition-colors">
                <MapPin className="w-6 h-6 text-[#0EA5A4] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-[#0F172A] mb-3">
                Destination Explorer
              </h3>
              <p className="text-[#475569] leading-relaxed">
                Browse curated travel guides and discover hidden gems in destinations worldwide.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl border border-[#E5E7EB] hover:border-[#F59E0B] transition-all duration-200 group">
              <div className="w-12 h-12 bg-[#F59E0B]/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#F59E0B] transition-colors">
                <TrendingUp className="w-6 h-6 text-[#F59E0B] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-[#0F172A] mb-3">
                Budget Management
              </h3>
              <p className="text-[#475569] leading-relaxed">
                Track expenses in real-time and stay on budget with intuitive financial tools.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-xl border border-[#E5E7EB] hover:border-[#1E3A8A] transition-all duration-200 group">
              <div className="w-12 h-12 bg-[#1E3A8A]/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#1E3A8A] transition-colors">
                <Shield className="w-6 h-6 text-[#1E3A8A] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-[#0F172A] mb-3">
                Secure & Private
              </h3>
              <p className="text-[#475569] leading-relaxed">
                Your travel plans are encrypted and protected. Only you have access to your data.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-xl border border-[#E5E7EB] hover:border-[#0EA5A4] transition-all duration-200 group">
              <div className="w-12 h-12 bg-[#0EA5A4]/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#0EA5A4] transition-colors">
                <Users className="w-6 h-6 text-[#0EA5A4] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-[#0F172A] mb-3">
                Collaborative Planning
              </h3>
              <p className="text-[#475569] leading-relaxed">
                Plan group trips together. Share itineraries and coordinate seamlessly with travel companions.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-xl border border-[#E5E7EB] hover:border-[#F59E0B] transition-all duration-200 group">
              <div className="w-12 h-12 bg-[#F59E0B]/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#F59E0B] transition-colors">
                <Globe2 className="w-6 h-6 text-[#F59E0B] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-[#0F172A] mb-3">
                Offline Access
              </h3>
              <p className="text-[#475569] leading-relaxed">
                Access your itineraries anywhere, anytime—even without an internet connection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-4">
              Simple. Powerful. Effective.
            </h2>
            <p className="text-lg text-[#475569]">
              Start planning your perfect trip in three easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1E3A8A] text-white font-bold text-2xl mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-[#0F172A] mb-3">
                Create Your Trip
              </h3>
              <p className="text-[#475569]">
                Set your destination, dates, and basic preferences to get started.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#0EA5A4] text-white font-bold text-2xl mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-[#0F172A] mb-3">
                Build Your Itinerary
              </h3>
              <p className="text-[#475569]">
                Add activities, accommodations, and transportation to each day of your trip.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F59E0B] text-white font-bold text-2xl mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-[#0F172A] mb-3">
                Travel with Confidence
              </h3>
              <p className="text-[#475569]">
                Access your plans on-the-go and make the most of every moment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-[#1E3A8A] to-[#0EA5A4]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to plan your next adventure?
          </h2>
          <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of travelers who trust TripCraft to bring their travel dreams to life.
          </p>
          <GradientLink
            variant="cta"
            size="lg"
            href="/signUp"
          >
            Start Planning for Free
          </GradientLink>
          <p className="text-sm text-blue-100 mt-4">
            No credit card required · Free forever
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}