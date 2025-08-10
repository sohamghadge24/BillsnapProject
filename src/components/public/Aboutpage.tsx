import React from 'react';
import { 
  Target, 
  Users, 
  Award, 
  Heart,
  Lightbulb,
  Shield,
  Globe,
  TrendingUp
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const values = [
    {
      icon: Target,
      title: 'Mission-Driven',
      description: 'We believe everyone deserves simple, powerful tools to manage their finances effectively.'
    },
    {
      icon: Shield,
      title: 'Security First',
      description: 'Your financial data is protected with bank-level security and privacy measures.'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We continuously innovate to bring you the latest in expense management technology.'
    },
    {
      icon: Heart,
      title: 'User-Centric',
      description: 'Every feature we build is designed with our users\' needs and feedback in mind.'
    }
  ];

  const team = [
    {
      name: 'Alex Thompson',
      role: 'CEO & Co-Founder',
      bio: 'Former fintech executive with 15+ years of experience in financial technology and product development.',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      name: 'Sarah Kim',
      role: 'CTO & Co-Founder',
      bio: 'Software architect and AI specialist who previously led engineering teams at major tech companies.',
      image: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Head of Product',
      bio: 'Product strategist with a passion for creating intuitive user experiences in financial applications.',
      image: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      name: 'Jennifer Liu',
      role: 'Head of Design',
      bio: 'Award-winning UX designer focused on making complex financial tools simple and accessible.',
      image: 'https://images.pexels.com/photos/3756681/pexels-photo-3756681.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const milestones = [
    {
      year: '2020',
      title: 'Company Founded',
      description: 'Started with a vision to simplify expense management for everyone.'
    },
    {
      year: '2021',
      title: 'First 1,000 Users',
      description: 'Reached our first milestone with positive user feedback and feature requests.'
    },
    {
      year: '2022',
      title: 'AI Integration',
      description: 'Launched smart receipt scanning with advanced OCR and data extraction.'
    },
    {
      year: '2023',
      title: 'Mobile App Launch',
      description: 'Released native mobile apps for iOS and Android platforms.'
    },
    {
      year: '2024',
      title: '50K+ Active Users',
      description: 'Grew to serve over 50,000 active users across 25+ countries.'
    },
    {
      year: '2025',
      title: 'Enterprise Solutions',
      description: 'Expanding to serve businesses with advanced team collaboration features.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              About <span className="text-blue-600">ExpenseTracker</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              We're on a mission to revolutionize how people and businesses manage their expenses. 
              Founded in 2020, we've grown from a simple idea to a comprehensive financial management platform 
              trusted by thousands of users worldwide.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
                <div className="text-gray-600">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">2M+</div>
                <div className="text-gray-600">Receipts Processed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">25+</div>
                <div className="text-gray-600">Countries Served</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                To democratize financial management by providing powerful, intuitive tools that help 
                individuals and businesses take control of their expenses. We believe that everyone 
                deserves access to professional-grade financial tracking, regardless of their technical 
                expertise or budget.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Through innovative technology like AI-powered receipt scanning and real-time analytics, 
                we're making expense management not just easier, but actually enjoyable.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Team collaboration"
                className="rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do, from product development to customer support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're a diverse group of passionate individuals united by our mission to transform expense management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From a simple idea to a comprehensive platform - here's how we've grown over the years.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{milestone.year}</span>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Join Our Growing Community
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Be part of the financial management revolution. Start your journey with ExpenseTracker today.
            </p>
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg">
              Get Started Free
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};