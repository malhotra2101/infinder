import React, { useState } from 'react';
import BrandCampaignCard from '../components/brand-campaign-card/BrandCampaignCard';
import './InfluencerSearchDemo.css';

/**
 * Influencer Search Demo Component
 * 
 * Demo page showcasing the brand and campaign cards for influencers
 * with sample data to demonstrate the functionality.
 */
const InfluencerSearchDemo = () => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [lastAppliedCampaign, setLastAppliedCampaign] = useState(null);

  // Sample data for demonstration
  const sampleBrandsWithCampaigns = [
    {
      brand: {
        id: 1,
        name: "Nike",
        industry: "Sports & Fitness",
        logo_url: "https://ui-avatars.com/api/?name=Nike&background=000000&color=fff&size=64",
        description: "Just Do It. Leading sports brand worldwide."
      },
      campaigns: [
        {
          id: 1,
          campaign_name: "Summer Fitness Challenge",
          status: "active",
          platform: "instagram",
          vertical: "fitness",
          offer_description: "Join our summer fitness challenge and inspire others to stay active. Perfect for fitness influencers with engaged audiences.",
          start_date: "2025-06-01",
          end_date: "2025-08-31",
          budget: 5000,
          leadflow: "CPL"
        },
        {
          id: 2,
          campaign_name: "Running Gear Launch",
          status: "active",
          platform: "youtube",
          vertical: "sports",
          offer_description: "Launch campaign for our new running collection. Looking for authentic runners to showcase our latest gear.",
          start_date: "2025-07-15",
          end_date: "2025-09-15",
          budget: 8000,
          leadflow: "CPC"
        }
      ]
    },
    {
      brand: {
        id: 2,
        name: "Apple",
        industry: "Technology",
        logo_url: "https://ui-avatars.com/api/?name=Apple&background=000000&color=fff&size=64",
        description: "Think Different. Innovation at its finest."
      },
      campaigns: [
        {
          id: 3,
          campaign_name: "iPhone 16 Launch",
          status: "active",
          platform: "tiktok",
          vertical: "tech",
          offer_description: "Be among the first to showcase the new iPhone 16. Create engaging content that highlights the latest features.",
          start_date: "2025-09-01",
          end_date: "2025-10-31",
          budget: 12000,
          leadflow: "CPL"
        }
      ]
    },
    {
      brand: {
        id: 3,
        name: "Starbucks",
        industry: "Food & Beverage",
        logo_url: "https://ui-avatars.com/api/?name=Starbucks&background=006241&color=fff&size=64",
        description: "Inspiring and nurturing the human spirit – one person, one cup, and one neighborhood at a time."
      },
      campaigns: [
        {
          id: 4,
          campaign_name: "Fall Drinks Campaign",
          status: "active",
          platform: "instagram",
          vertical: "lifestyle",
          offer_description: "Showcase our new fall drink collection. Perfect for lifestyle and food influencers who love coffee culture.",
          start_date: "2025-09-15",
          end_date: "2025-11-30",
          budget: 3000,
          leadflow: "CPC"
        },
        {
          id: 5,
          campaign_name: "Holiday Season Special",
          status: "active",
          platform: "youtube",
          vertical: "food",
          offer_description: "Create festive content featuring our holiday drink menu. Looking for creators who can make our drinks look magical.",
          start_date: "2025-11-01",
          end_date: "2025-12-31",
          budget: 6000,
          leadflow: "CPL"
        }
      ]
    },
    {
      brand: {
        id: 4,
        name: "Tesla",
        industry: "Automotive",
        logo_url: "https://ui-avatars.com/api/?name=Tesla&background=cc0000&color=fff&size=64",
        description: "Accelerating the world's transition to sustainable energy."
      },
      campaigns: [
        {
          id: 6,
          campaign_name: "Model Y Experience",
          status: "active",
          platform: "youtube",
          vertical: "automotive",
          offer_description: "Experience the Tesla Model Y and share your journey. Perfect for automotive and tech influencers.",
          start_date: "2025-08-01",
          end_date: "2025-10-31",
          budget: 15000,
          leadflow: "CPL"
        }
      ]
    }
  ];

  // Handle apply to campaign
  const handleApply = (campaign) => {
    setLastAppliedCampaign(campaign);
    setShowSuccessMessage(true);
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
      setLastAppliedCampaign(null);
    }, 5000);
  };

  return (
    <div className="influencer-search-demo">
      {/* Header */}
      <div className="influencer-search-demo__header">
        <div className="influencer-search-demo__header-content">
          <h1 className="influencer-search-demo__title">Influencer Search Demo</h1>
          <p className="influencer-search-demo__subtitle">
            Discover amazing brands and campaigns to collaborate with. Click on any card to expand and see campaign details.
          </p>
        </div>
      </div>

      {/* Success Message */}
      {showSuccessMessage && lastAppliedCampaign && (
        <div className="influencer-search-demo__success-message">
          <div className="influencer-search-demo__success-content">
            <span className="influencer-search-demo__success-icon">✅</span>
            <div className="influencer-search-demo__success-text">
              <h3>Application Submitted!</h3>
              <p>Your application for "{lastAppliedCampaign.campaign_name}" has been submitted successfully.</p>
            </div>
            <button 
              className="influencer-search-demo__close-success"
              onClick={() => setShowSuccessMessage(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Demo Instructions */}
      <div className="influencer-search-demo__instructions">
        <div className="influencer-search-demo__instruction-card">
          <h3>How to Use</h3>
          <ol>
            <li>Click on any brand card to expand it</li>
            <li>Browse through the available campaigns</li>
            <li>Select a campaign that interests you</li>
            <li>Click "Apply" to submit your application</li>
          </ol>
        </div>
      </div>

      {/* Brand Cards Grid */}
      <div className="influencer-search-demo__grid">
        {sampleBrandsWithCampaigns.map((brandData) => (
          <BrandCampaignCard
            key={brandData.brand.id}
            brand={brandData.brand}
            campaigns={brandData.campaigns}
            onApply={handleApply}
          />
        ))}
      </div>

      {/* Features Showcase */}
      <div className="influencer-search-demo__features">
        <h2>Key Features</h2>
        <div className="influencer-search-demo__features-grid">
          <div className="influencer-search-demo__feature">
            <div className="influencer-search-demo__feature-icon">🎯</div>
            <h3>Smart Matching</h3>
            <p>Find campaigns that match your niche, platform, and audience demographics.</p>
          </div>
          <div className="influencer-search-demo__feature">
            <div className="influencer-search-demo__feature-icon">📱</div>
            <h3>Multi-Platform</h3>
            <p>Discover campaigns across Instagram, YouTube, TikTok, and more platforms.</p>
          </div>
          <div className="influencer-search-demo__feature">
            <div className="influencer-search-demo__feature-icon">💰</div>
            <h3>Transparent Budgets</h3>
            <p>See campaign budgets upfront to find opportunities that match your rates.</p>
          </div>
          <div className="influencer-search-demo__feature">
            <div className="influencer-search-demo__feature-icon">⚡</div>
            <h3>Quick Apply</h3>
            <p>Apply to campaigns with just one click. No lengthy application forms.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerSearchDemo; 