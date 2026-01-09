import React from 'react';
import Image from 'next/image';
import { GradientLink } from '@/components/ui/GradientButton';
import { Target, Heart, Zap, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1E3A8A] to-[#0EA5A4] py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                About TripCraft
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                We believe travel planning should be exciting, not overwhelming. 
                TripCraft was built to help travelers focus on what matters—creating 
                memorable experiences.
              </p>
            </div>

            {/* Right Image */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-full h-full min-h-[400px]">
                <Image
                  src="/images/aboutPage/AboutHeroImg.png"
                  alt="TripCraft travel planning dashboard on laptop"
                  width={800} 
                  height={400}
                  className="object-contain rounded-xl shadow-sm drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 lg:py-28 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-[#475569] mb-6 leading-relaxed">
                Travel opens doors to new cultures, perspectives, and experiences. 
                But planning shouldn't be a barrier to adventure.
              </p>
              <p className="text-lg text-[#475569] leading-relaxed">
                TripCraft empowers travelers with simple, powerful tools to organize 
                every aspect of their journey—from itineraries to budgets—so they can 
                spend less time planning and more time exploring.
              </p>
            </div>

            <div className="bg-white p-10 rounded-2xl border border-[#E5E7EB] shadow-sm">
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#1E3A8A]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-[#1E3A8A]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0F172A] mb-2">Clear Vision</h3>
                    <p className="text-[#475569]">
                      Make travel planning accessible to everyone, regardless of experience level.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#0EA5A4]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-[#0EA5A4]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0F172A] mb-2">User-Centered</h3>
                    <p className="text-[#475569]">
                      Every feature is designed with real travelers' needs in mind.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#F59E0B]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-[#F59E0B]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0F172A] mb-2">Continuous Innovation</h3>
                    <p className="text-[#475569]">
                      We constantly improve based on feedback and emerging travel trends.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-4">
              What We Stand For
            </h2>
            <p className="text-lg text-[#475569]">
              The principles that guide everything we build
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-[#F8FAFC] rounded-xl">
              <h3 className="text-xl font-semibold text-[#0F172A] mb-3">
                Simplicity First
              </h3>
              <p className="text-[#475569] leading-relaxed">
                We believe the best tools are intuitive. Complex features shouldn't 
                require complex interfaces. Every interaction is crafted to be clear 
                and straightforward.
              </p>
            </div>

            <div className="p-8 bg-[#F8FAFC] rounded-xl">
              <h3 className="text-xl font-semibold text-[#0F172A] mb-3">
                Privacy Matters
              </h3>
              <p className="text-[#475569] leading-relaxed">
                Your travel plans are personal. We use industry-standard encryption 
                and never share your data with third parties. Your information belongs 
                to you, always.
              </p>
            </div>

            <div className="p-8 bg-[#F8FAFC] rounded-xl">
              <h3 className="text-xl font-semibold text-[#0F172A] mb-3">
                Built for Real People
              </h3>
              <p className="text-[#475569] leading-relaxed">
                We're travelers too. Every feature comes from real experiences and 
                genuine pain points we've encountered while planning our own trips.
              </p>
            </div>

            <div className="p-8 bg-[#F8FAFC] rounded-xl">
              <h3 className="text-xl font-semibold text-[#0F172A] mb-3">
                Constantly Evolving
              </h3>
              <p className="text-[#475569] leading-relaxed">
                Travel changes, and so do we. We actively listen to our community 
                and regularly ship improvements based on your feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 lg:py-28 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-8 text-center">
            How TripCraft Began
          </h2>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-[#475569] mb-6 leading-relaxed">
              TripCraft started from a simple frustration: planning a two-week trip 
              to Southeast Asia shouldn't require juggling spreadsheets, notes apps, 
              and countless browser tabs.
            </p>
            
            <p className="text-lg text-[#475569] mb-6 leading-relaxed">
              After struggling with fragmented tools and losing important details in 
              the chaos, we realized there had to be a better way. We wanted one place 
              to manage everything—itineraries, budgets, bookings, and notes.
            </p>
            
            <p className="text-lg text-[#475569] leading-relaxed">
              So we built TripCraft. What started as a personal project grew into a 
              platform used by thousands of travelers worldwide. Today, we're proud 
              to help people turn their travel dreams into reality with less stress 
              and more confidence.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-[#1E3A8A] to-[#0EA5A4]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Join Our Community
          </h2>
          <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">
            Become part of a growing community of travelers who plan smarter and 
            travel better with TripCraft.
          </p>
          <GradientLink
            variant="cta"
            size="lg"
            href="/signUp"
          >
            Get Started Free
          </GradientLink>
        </div>
      </section>
    </div>
  );
}