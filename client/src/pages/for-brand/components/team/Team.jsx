import React from 'react';
import PropTypes from 'prop-types';
import './Team.css';

/**
 * Team Component - Employee Showcase Section
 * 
 * Displays our top employees and team members to build trust and showcase expertise.
 * Features include:
 * - Employee cards with photos
 * - Experience and role information
 * - Professional backgrounds
 * - Responsive design
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Section title
 * @param {string} props.subtitle - Section subtitle
 * @param {Array} props.employees - Array of employee objects
 * @returns {JSX.Element} Team section component
 */
const Team = ({
  title = "Meet Our Expert Team",
  subtitle = "The talented professionals behind Infinder's success",
  employees = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Chief Technology Officer",
      experience: "12+ years",
      department: "Engineering",
      avatar: null,
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
      avatar: null,
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
      avatar: null,
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
      avatar: null,
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
      avatar: null,
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
      avatar: null,
      bio: "Frontend specialist creating intuitive user experiences. Passionate about modern web technologies and accessibility.",
      skills: ["React", "TypeScript", "UI/UX"],
      linkedin: "https://linkedin.com/in/alex-martinez"
    }
  ]
}) => {
  return (
    <section className="team" id="team">
      <div className="team__container">
        {/* Section Header */}
        <div className="team__header">
          <h2 className="team__title">{title}</h2>
          <p className="team__subtitle">{subtitle}</p>
        </div>

        {/* Team Grid */}
        <div className="team__grid">
          {employees.map((employee) => (
            <div key={employee.id} className="team__card">
              {/* Employee Avatar */}
              <div className="team__avatar-container">
                {employee.avatar ? (
                  <img 
                    src={employee.avatar} 
                    alt={employee.name}
                    className="team__avatar"
                    loading="lazy"
                  />
                ) : (
                  <div className="team__avatar team__avatar--placeholder">
                    {employee.name.charAt(0)}
                  </div>
                )}
                <div className="team__department-badge">
                  {employee.department}
                </div>
              </div>

              {/* Employee Info */}
              <div className="team__info">
                <h3 className="team__name">{employee.name}</h3>
                <p className="team__role">{employee.role}</p>
                <div className="team__experience">
                  <span className="team__experience-label">Experience:</span>
                  <span className="team__experience-years">{employee.experience}</span>
                </div>
              </div>

              {/* Employee Bio */}
              <p className="team__bio">{employee.bio}</p>

              {/* Skills */}
              <div className="team__skills">
                <h4 className="team__skills-title">Expertise</h4>
                <div className="team__skills-list">
                  {employee.skills.map((skill, index) => (
                    <span key={index} className="team__skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* LinkedIn Link */}
              {employee.linkedin && (
                <a 
                  href={employee.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="team__linkedin-link"
                  aria-label={`Connect with ${employee.name} on LinkedIn`}
                >
                  <svg className="team__linkedin-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  Connect on LinkedIn
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Team Stats */}
        <div className="team__stats">
          <div className="team__stat-item">
            <span className="team__stat-number">50+</span>
            <span className="team__stat-label">Team Members</span>
          </div>
          <div className="team__stat-item">
            <span className="team__stat-number">15+</span>
            <span className="team__stat-label">Years Combined Experience</span>
          </div>
          <div className="team__stat-item">
            <span className="team__stat-number">100+</span>
            <span className="team__stat-label">Successful Projects</span>
          </div>
        </div>
      </div>
    </section>
  );
};

// PropTypes for type checking and documentation
Team.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  employees: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      experience: PropTypes.string.isRequired,
      department: PropTypes.string.isRequired,
      avatar: PropTypes.string,
      bio: PropTypes.string.isRequired,
      skills: PropTypes.arrayOf(PropTypes.string).isRequired,
      linkedin: PropTypes.string
    })
  )
};

export default Team; 