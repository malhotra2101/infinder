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
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
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
 * Features section configuration
 */
export const FEATURES_CONFIG = {
  title: "Powerful Features for Modern Marketing",
  subtitle: "Everything you need to discover, connect, and collaborate with influencers effectively.",
  features: [
    {
      icon: '🎯',
      title: 'AI-Powered Matching',
      description: 'Our advanced AI algorithm matches your brand with the perfect influencers based on audience demographics, content style, and engagement rates.',
      color: 'blue'
    },
    {
      icon: '📊',
      title: 'Advanced Analytics',
      description: 'Track campaign performance with detailed analytics, ROI calculations, and real-time insights to optimize your influencer partnerships.',
      color: 'green'
    },
    {
      icon: '🤝',
      title: 'Authentic Partnerships',
      description: 'Build genuine relationships with influencers through our streamlined communication tools and collaboration features.',
      color: 'purple'
    },
    {
      icon: '⚡',
      title: 'Campaign Management',
      description: 'Manage multiple influencer campaigns from a single dashboard with automated workflows and progress tracking.',
      color: 'orange'
    },
    {
      icon: '🔒',
      title: 'Secure Payments',
      description: 'Handle influencer payments securely with our integrated payment system and transparent transaction tracking.',
      color: 'red'
    },
    {
      icon: '📱',
      title: 'Mobile Optimization',
      description: 'Access your campaigns on the go with our mobile-optimized platform that works seamlessly across all devices.',
      color: 'teal'
    }
  ],
  layout: 'grid'
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
 * Pricing configuration
 */
export const PRICING_CONFIG = {
  title: "Simple, Transparent Pricing",
  subtitle: "Choose the plan that fits your needs. All plans include our core features.",
  plans: [
    {
      name: 'Starter',
      price: '$99',
      period: 'per month',
      description: 'Perfect for small brands getting started with influencer marketing.',
      features: [
        'Up to 10 influencer campaigns',
        'Basic analytics and reporting',
        'Email support',
        'Standard integrations'
      ],
      popular: false,
      cta: 'Start Free Trial'
    },
    {
      name: 'Professional',
      price: '$299',
      period: 'per month',
      description: 'Ideal for growing businesses with multiple campaigns.',
      features: [
        'Up to 50 influencer campaigns',
        'Advanced analytics and insights',
        'Priority support',
        'Custom integrations',
        'Team collaboration tools'
      ],
      popular: true,
      cta: 'Start Free Trial'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'per month',
      description: 'For large organizations with complex influencer marketing needs.',
      features: [
        'Unlimited campaigns',
        'Custom analytics and reporting',
        'Dedicated account manager',
        'Custom integrations and API access',
        'Advanced team management',
        'White-label solutions'
      ],
      popular: false,
      cta: 'Contact Sales'
    }
  ]
};

/**
 * Team section configuration
 */
export const TEAM_CONFIG = {
  title: "Meet Our Expert Team",
  subtitle: "The talented professionals behind Infinder's success",
  employees: [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Chief Technology Officer",
      experience: "12+ years",
      department: "Engineering",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
      bio: "Leading our technical vision with expertise in scalable architecture and AI-driven solutions. Former Senior Engineer at Google and Microsoft.",
      skills: ["AI/ML", "Cloud Architecture", "Team Leadership"],
      linkedin: "https://linkedin.com/in/sarah-johnson"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Head of Product",
      experience: "8+ years",
      department: "Product",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
      bio: "Product strategist with a passion for user-centered design. Previously led product teams at Spotify and Airbnb, focusing on growth and engagement.",
      skills: ["Product Strategy", "UX Design", "Growth Hacking"],
      linkedin: "https://linkedin.com/in/michael-chen"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "VP of Marketing",
      experience: "10+ years",
      department: "Marketing",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
      bio: "Marketing expert specializing in influencer marketing and brand partnerships. Built successful campaigns for Fortune 500 companies.",
      skills: ["Influencer Marketing", "Brand Strategy", "Campaign Management"],
      linkedin: "https://linkedin.com/in/emily-rodriguez"
    },
    {
      id: 4,
      name: "David Kim",
      role: "Senior Data Scientist",
      experience: "6+ years",
      department: "Data Science",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      bio: "Data science expert focused on machine learning algorithms for influencer matching and performance prediction.",
      skills: ["Machine Learning", "Python", "Data Analytics"],
      linkedin: "https://linkedin.com/in/david-kim"
    },
    {
      id: 5,
      name: "Lisa Thompson",
      role: "Head of Customer Success",
      experience: "7+ years",
      department: "Customer Success",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      bio: "Customer success leader dedicated to ensuring client satisfaction and platform adoption. Expert in building long-term client relationships.",
      skills: ["Customer Success", "Client Relations", "Platform Training"],
      linkedin: "https://linkedin.com/in/lisa-thompson"
    },
    {
      id: 6,
      name: "Alex Martinez",
      role: "Lead Frontend Developer",
      experience: "5+ years",
      department: "Engineering",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      bio: "Frontend specialist creating intuitive user experiences. Passionate about modern web technologies and accessibility.",
      skills: ["React", "TypeScript", "UI/UX"],
      linkedin: "https://linkedin.com/in/alex-martinez"
    }
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