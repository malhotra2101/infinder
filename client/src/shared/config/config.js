/**
 * Application Configuration
 * 
 * Centralized configuration for app-wide settings, data, and constants.
 * Makes it easier to maintain and update application settings.
 */

/**
 * Contact form configuration
 */
export const CONTACT_CONFIG = {
  title: "Get in Touch",
  subtitle: "Ready to transform your influencer marketing? Let's talk.",
  contactInfo: {
    email: 'hello@infinder.com',
    phone: '+1 (555) 123-4567',
    address: '123 Innovation Drive, Tech City, TC 12345',
    social: {
      twitter: 'https://twitter.com/infinder',
      linkedin: 'https://linkedin.com/company/infinder',
      facebook: 'https://facebook.com/infinder'
    }
  }
};

/**
 * Footer configuration
 */
export const FOOTER_CONFIG = {
  companyInfo: {
    name: 'Infinder',
    description: 'Empowering brands to discover, connect, and collaborate with the perfect influencers.',
    logo: '/logo.svg',
    copyright: '© 2024 Infinder. All rights reserved.'
  },
  navigation: {
    product: [
      { label: 'API', href: '/api' },
      { label: 'Integrations', href: '/integrations' }
    ],
    company: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' }
    ],
    support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact', href: '/contact' },
      { label: 'Status', href: '/status' },
      { label: 'Documentation', href: '/docs' }
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'GDPR', href: '/gdpr' }
    ]
  },
  social: {
    twitter: 'https://twitter.com/infinder',
    linkedin: 'https://linkedin.com/company/infinder',
    facebook: 'https://facebook.com/infinder',
    instagram: 'https://instagram.com/infinder'
  }
};

/**
 * Hero section configuration
 */
export const HERO_CONFIG = {
  title: "Transform Your Influencer Marketing",
  subtitle: "Discover, connect, and collaborate with the perfect influencers using AI-powered matching. Build authentic partnerships that drive real results and scale your brand presence.",
  actions: [
    { label: 'Start Free Trial', href: '/signup', variant: 'primary' },
    { label: 'Watch Demo', href: '#demo', variant: 'secondary' }
  ],
  features: [
    { icon: '🚀', text: 'AI-Powered Matching' },
    { icon: '📈', text: 'Real-time Analytics' },
    { icon: '💎', text: 'Premium Influencers' }
  ],
  stats: {
    users: '15,000+',
    influencers: '75,000+',
    campaigns: '150,000+'
  },
  showAnimation: true
};



/**
 * Call to action configuration
 */
export const CTA_CONFIG = {
  title: "Ready to Get Started?",
  subtitle: "Join thousands of brands already using Infinder to transform their influencer marketing.",
  actions: [
    { label: 'Start Free Trial', href: '/signup', variant: 'primary' },
    { label: 'Schedule Demo', href: '/demo', variant: 'secondary' }
  ]
};





/**
 * Page metadata configuration
 */
export const PAGE_CONFIG = {
  home: {
    title: "Infinder - Influencer Marketing Platform",
    description: "Empower your influencer marketing strategies with cutting-edge tools and analytics. Find, manage, and track influencer campaigns with precision."
  },
  contact: {
    title: "Contact Us - Infinder",
    description: "Get in touch with our team to learn how Infinder can transform your influencer marketing strategy."
  },
  search: {
    title: "Search Influencers - Infinder",
    description: "Discover and connect with the perfect influencers for your brand using our advanced search and matching tools."
  }
}; 