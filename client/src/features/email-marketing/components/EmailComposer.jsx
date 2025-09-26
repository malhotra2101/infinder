import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/components/AuthContext';
import './EmailComposer.css';
import { API_CONFIG } from '../../../shared/config/config.js';

const EmailComposer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Get selected influencers and campaign from location state
  const { selectedInfluencers = [], campaignId = null, campaignName = '' } = location.state || {};
  
  const [step, setStep] = useState(1); // 1: Template, 2: Customize, 3: Schedule, 4: Review
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [sequenceSteps, setSequenceSteps] = useState([
    {
      id: 1,
      template_id: null,
      custom_subject: '',
      custom_body: '',
      delay_days: 0,
      delay_hours: 0
    }
  ]);
  const [sequenceName, setSequenceName] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState({ subject: '', body: '' });

  // Redirect if no selected influencers
  useEffect(() => {
    if (!selectedInfluencers.length || !campaignId) {
      navigate('/campaigns', { 
        state: { 
          error: 'Please select influencers and campaign first' 
        }
      });
    }
  }, [selectedInfluencers, campaignId, navigate]);

  // Load email templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/email-templates`);
        const result = await response.json();
        if (result.success) {
          setTemplates(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch templates:', error);
      }
    };

    fetchTemplates();
  }, []);

  // Generate sequence name based on campaign
  useEffect(() => {
    if (campaignName && !sequenceName) {
      setSequenceName(`${campaignName} - Email Sequence`);
    }
  }, [campaignName, sequenceName]);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setSequenceSteps(prev => [
      {
        ...prev[0],
        template_id: template.id,
        custom_subject: template.subject_template,
        custom_body: template.body_template
      }
    ]);
    generatePreview(template);
  };

  const generatePreview = async (template) => {
    if (!template || !selectedInfluencers.length) return;

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/email-templates/${template.id}/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sampleData: {
            influencer_name: selectedInfluencers[0].name,
            campaign_name: campaignName,
            influencer_platform: selectedInfluencers[0].platform,
            influencer_followers: selectedInfluencers[0].followers
          }
        })
      });

      const result = await response.json();
      if (result.success) {
        setPreview(result.data.preview);
      }
    } catch (error) {
      console.error('Failed to generate preview:', error);
    }
  };

  const addSequenceStep = () => {
    const newStep = {
      id: sequenceSteps.length + 1,
      template_id: null,
      custom_subject: '',
      custom_body: '',
      delay_days: 3,
      delay_hours: 0
    };
    setSequenceSteps([...sequenceSteps, newStep]);
  };

  const updateSequenceStep = (stepIndex, field, value) => {
    setSequenceSteps(prev => 
      prev.map((step, index) => 
        index === stepIndex ? { ...step, [field]: value } : step
      )
    );
  };

  const removeSequenceStep = (stepIndex) => {
    if (sequenceSteps.length > 1) {
      setSequenceSteps(prev => prev.filter((_, index) => index !== stepIndex));
    }
  };

  const createSequence = async () => {
    setLoading(true);
    try {
      const sequenceData = {
        brand_id: user?.id || 1,
        brand_name: user?.brandName || 'Your Brand',
        campaign_id: campaignId,
        name: sequenceName,
        steps: sequenceSteps.map((step, index) => ({
          template_id: step.template_id,
          custom_subject: step.custom_subject,
          custom_body: step.custom_body,
          delay_days: step.delay_days,
          delay_hours: step.delay_hours
        })),
        recipients: selectedInfluencers.map(influencer => ({
          influencer_id: influencer.id,
          email: influencer.email || `${influencer.name.toLowerCase().replace(/\s+/g, '')}@example.com`
        }))
      };

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/email-sequences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sequenceData)
      });

      const result = await response.json();
      if (result.success) {
        navigate('/campaigns', {
          state: {
            success: 'Email sequence created successfully! You can start it from the sequences tab.',
            sequenceId: result.data.sequence.id
          }
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Failed to create sequence:', error);
      alert('Failed to create email sequence. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  if (!selectedInfluencers.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="email-composer">
      <div className="email-composer-header">
        <button onClick={() => navigate('/campaigns')} className="back-button">
          ← Back to Campaigns
        </button>
        <h1>Create Email Sequence</h1>
        <div className="step-indicator">
          {['Template', 'Customize', 'Schedule', 'Review'].map((stepName, index) => (
            <div 
              key={stepName}
              className={`step ${index + 1 === step ? 'active' : index + 1 < step ? 'completed' : ''}`}
            >
              <span className="step-number">{index + 1}</span>
              <span className="step-name">{stepName}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="email-composer-content">
        {step === 1 && (
          <div className="template-selection">
            <h2>Choose Email Template</h2>
            <div className="templates-grid">
              {templates.map(template => (
                <div 
                  key={template.id}
                  className={`template-card ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <div className="template-category">{template.category}</div>
                  <h3>{template.name}</h3>
                  <p>{template.subject_template}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="email-customization">
            <h2>Customize Email Content</h2>
            <div className="customization-layout">
              <div className="email-editor">
                <div className="form-group">
                  <label>Subject Line</label>
                  <input
                    type="text"
                    value={sequenceSteps[0]?.custom_subject || ''}
                    onChange={(e) => updateSequenceStep(0, 'custom_subject', e.target.value)}
                    placeholder="Email subject"
                  />
                </div>
                <div className="form-group">
                  <label>Email Body</label>
                  <textarea
                    value={sequenceSteps[0]?.custom_body || ''}
                    onChange={(e) => updateSequenceStep(0, 'custom_body', e.target.value)}
                    placeholder="Email content"
                    rows={12}
                  />
                </div>
                <div className="variables-help">
                  <h4>Available Variables:</h4>
                  <div className="variables-list">
                    <span>{'{influencer_name}'}</span>
                    <span>{'{brand_name}'}</span>
                    <span>{'{campaign_name}'}</span>
                    <span>{'{influencer_platform}'}</span>
                    <span>{'{influencer_followers}'}</span>
                  </div>
                </div>
              </div>
              <div className="email-preview">
                <h4>Preview</h4>
                <div className="preview-container">
                  <div className="preview-subject">
                    <strong>Subject:</strong> {preview.subject}
                  </div>
                  <div className="preview-body">
                    {preview.body?.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="sequence-scheduling">
            <h2>Schedule Follow-ups</h2>
            <div className="sequence-steps">
              {sequenceSteps.map((sequenceStep, index) => (
                <div key={sequenceStep.id} className="sequence-step-card">
                  <div className="step-header">
                    <h4>
                      {index === 0 ? 'Initial Email' : `Follow-up ${index}`}
                      {index === 0 ? ' (Immediate)' : ''}
                    </h4>
                    {index > 0 && (
                      <button 
                        onClick={() => removeSequenceStep(index)}
                        className="remove-step"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  {index > 0 && (
                    <div className="timing-controls">
                      <label>Send after:</label>
                      <div className="timing-inputs">
                        <input
                          type="number"
                          value={sequenceStep.delay_days}
                          onChange={(e) => updateSequenceStep(index, 'delay_days', parseInt(e.target.value))}
                          min="0"
                        />
                        <span>days</span>
                        <input
                          type="number"
                          value={sequenceStep.delay_hours}
                          onChange={(e) => updateSequenceStep(index, 'delay_hours', parseInt(e.target.value))}
                          min="0"
                          max="23"
                        />
                        <span>hours</span>
                      </div>
                    </div>
                  )}

                  <div className="step-content">
                    <input
                      type="text"
                      placeholder="Subject line"
                      value={sequenceStep.custom_subject}
                      onChange={(e) => updateSequenceStep(index, 'custom_subject', e.target.value)}
                    />
                    <textarea
                      placeholder="Email content"
                      value={sequenceStep.custom_body}
                      onChange={(e) => updateSequenceStep(index, 'custom_body', e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
              ))}
              
              <button onClick={addSequenceStep} className="add-step-button">
                + Add Follow-up Email
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="sequence-review">
            <h2>Review & Send</h2>
            
            <div className="review-section">
              <h3>Sequence Details</h3>
              <div className="form-group">
                <label>Sequence Name</label>
                <input
                  type="text"
                  value={sequenceName}
                  onChange={(e) => setSequenceName(e.target.value)}
                  placeholder="Enter sequence name"
                />
              </div>
            </div>

            <div className="review-section">
              <h3>Recipients ({selectedInfluencers.length})</h3>
              <div className="recipients-list">
                {selectedInfluencers.slice(0, 5).map(influencer => (
                  <div key={influencer.id} className="recipient-item">
                    <img src={influencer.avatar || '/avatars/sarah.jpg'} alt={influencer.name} />
                    <div>
                      <div className="name">{influencer.name}</div>
                      <div className="platform">{influencer.platform} • {influencer.followers} followers</div>
                    </div>
                  </div>
                ))}
                {selectedInfluencers.length > 5 && (
                  <div className="more-recipients">
                    +{selectedInfluencers.length - 5} more influencers
                  </div>
                )}
              </div>
            </div>

            <div className="review-section">
              <h3>Email Sequence ({sequenceSteps.length} emails)</h3>
              <div className="sequence-timeline">
                {sequenceSteps.map((sequenceStep, index) => (
                  <div key={sequenceStep.id} className="timeline-item">
                    <div className="timeline-marker">{index + 1}</div>
                    <div className="timeline-content">
                      <div className="timeline-title">
                        {index === 0 ? 'Initial Email' : `Follow-up ${index}`}
                      </div>
                      <div className="timeline-timing">
                        {index === 0 ? 'Immediate' : `${sequenceStep.delay_days} days, ${sequenceStep.delay_hours} hours later`}
                      </div>
                      <div className="timeline-subject">
                        Subject: {sequenceStep.custom_subject}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="email-composer-footer">
        <div className="footer-buttons">
          {step > 1 && (
            <button onClick={prevStep} className="button secondary">
              Previous
            </button>
          )}
          
          {step < 4 ? (
            <button 
              onClick={nextStep} 
              className="button primary"
              disabled={step === 1 && !selectedTemplate}
            >
              Next
            </button>
          ) : (
            <button 
              onClick={createSequence} 
              className="button primary"
              disabled={loading || !sequenceName.trim()}
            >
              {loading ? 'Creating...' : 'Create Sequence'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailComposer;
