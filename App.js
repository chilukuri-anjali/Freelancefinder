import React, { useState, createContext, useContext, useEffect } from 'react';
import './App.css';

// Auth Context with Persistent Storage
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [applications, setApplications] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);

  // Load data from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('sbworks_user');
    const savedApplications = localStorage.getItem('sbworks_applications');
    const savedRegisteredUsers = localStorage.getItem('sbworks_registered_users');

    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsSignedIn(true);
    }
    if (savedApplications) {
      setApplications(JSON.parse(savedApplications));
    }
    if (savedRegisteredUsers) {
      setRegisteredUsers(JSON.parse(savedRegisteredUsers));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('sbworks_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('sbworks_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('sbworks_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('sbworks_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  const signIn = (userData) => {
    // Check if user exists and password matches
    const existingUser = registeredUsers.find(u => u.email === userData.email);
    if (existingUser && existingUser.password === 'sbworks123') {
      const userProfile = {
        ...existingUser,
        applicationsSent: applications.length,
        projectsCompleted: 0,
        totalEarnings: 0
      };
      setUser(userProfile);
      setIsSignedIn(true);
      return true;
    }
    return false;
  };

  const signUp = (userData) => {
    // Check if user already exists
    if (registeredUsers.find(u => u.email === userData.email)) {
      return false; // User already exists
    }

    const newUser = {
      ...userData,
      password: 'sbworks123', // Single password for all users
      joinDate: new Date().toISOString()
    };

    setRegisteredUsers(prev => [...prev, newUser]);
    
    // Automatically sign in after signup
    const userProfile = {
      ...newUser,
      applicationsSent: 0,
      projectsCompleted: 0,
      totalEarnings: 0
    };
    setUser(userProfile);
    setIsSignedIn(true);
    return true;
  };

  const signOut = () => {
    // Don't clear applications - keep them for when user signs back in
    setUser(null);
    setIsSignedIn(false);
  };

  const addApplication = (projectTitle, client) => {
    const newApp = {
      id: Date.now(),
      projectTitle,
      client,
      appliedDate: new Date().toLocaleDateString(),
      status: "pending",
      userEmail: user?.email
    };
    setApplications(prev => [newApp, ...prev]);
    
    // Update user's application count
    if (user) {
      setUser(prev => ({
        ...prev,
        applicationsSent: prev.applicationsSent + 1
      }));
    }
  };

  // Get applications for current user
  const getUserApplications = () => {
    if (!user) return [];
    return applications.filter(app => app.userEmail === user.email);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isSignedIn, 
      signIn, 
      signUp,
      signOut, 
      applications: getUserApplications(),
      addApplication,
      registeredUsers
    }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Enhanced Mock project data with all categories
const mockProjects = [
  {
    id: 1,
    title: "Restaurant Management System with POS Integration",
    description: "Looking for an experienced developer to build a comprehensive restaurant management system with point-of-sale integration, inventory tracking, and staff management features.",
    budget: "8500",
    duration: "3-4 months",
    experienceLevel: "Expert",
    category: "Web Development",
    skills: ["React", "Node.js", "PostgreSQL", "Payment Integration"],
    client: { name: "TechCorp Solutions" },
    proposalCount: 12,
    createdAt: new Date("2024-06-20")
  },
  {
    id: 2,
    title: "Cross-Platform Fitness App with AI Personal Trainer",
    description: "Develop a mobile fitness application with AI-powered personal training recommendations, workout tracking, and social features.",
    budget: "12000",
    duration: "4-5 months",
    experienceLevel: "Expert",
    category: "Mobile Apps",
    skills: ["React Native", "AI/ML", "Firebase", "Health APIs"],
    client: { name: "FitLife Inc" },
    proposalCount: 8,
    createdAt: new Date("2024-06-19")
  },
  {
    id: 3,
    title: "E-commerce Website with Custom Payment Gateway",
    description: "Build a modern e-commerce platform with custom payment processing, inventory management, and customer analytics dashboard.",
    budget: "15000",
    duration: "5-6 months",
    experienceLevel: "Expert",
    category: "Web Development",
    skills: ["React", "Node.js", "Stripe", "MongoDB"],
    client: { name: "ShopSmart Ltd" },
    proposalCount: 15,
    createdAt: new Date("2024-06-18")
  },
  {
    id: 4,
    title: "Social Media Marketing Dashboard",
    description: "Create a comprehensive dashboard for managing multiple social media accounts with analytics, scheduling, and content creation tools.",
    budget: "9500",
    duration: "3-4 months",
    experienceLevel: "Intermediate",
    category: "Web Development",
    skills: ["Vue.js", "Python", "API Integration", "Data Visualization"],
    client: { name: "Digital Marketing Pro" },
    proposalCount: 6,
    createdAt: new Date("2024-06-17")
  },
  // DevOps Projects
  {
    id: 5,
    title: "Kubernetes Infrastructure Setup and CI/CD Pipeline",
    description: "Need DevOps engineer to set up Kubernetes cluster, implement CI/CD pipelines with Jenkins, and configure monitoring with Prometheus and Grafana.",
    budget: "7500",
    duration: "2-3 months",
    experienceLevel: "Expert",
    category: "DevOps",
    skills: ["Kubernetes", "Docker", "Jenkins", "AWS", "Terraform"],
    client: { name: "CloudTech Enterprises" },
    proposalCount: 5,
    createdAt: new Date("2024-06-16")
  },
  {
    id: 6,
    title: "AWS Cloud Migration and Infrastructure Automation",
    description: "Migrate existing infrastructure to AWS, implement Infrastructure as Code using Terraform, and set up automated deployment pipelines.",
    budget: "11000",
    duration: "4 months",
    experienceLevel: "Expert",
    category: "DevOps",
    skills: ["AWS", "Terraform", "Ansible", "Docker", "GitLab CI"],
    client: { name: "MigrationPro" },
    proposalCount: 7,
    createdAt: new Date("2024-06-15")
  },
  // UI/UX Design Projects
  {
    id: 7,
    title: "Complete UI/UX Redesign for E-learning Platform",
    description: "Redesign user interface and user experience for online learning platform. Need wireframes, prototypes, and final design system with component library.",
    budget: "4500",
    duration: "6-8 weeks",
    experienceLevel: "Intermediate",
    category: "UI/UX Design",
    skills: ["Figma", "Adobe XD", "User Research", "Prototyping", "Design Systems"],
    client: { name: "EduTech Solutions" },
    proposalCount: 12,
    createdAt: new Date("2024-06-14")
  },
  {
    id: 8,
    title: "Mobile App UI Design for Healthcare Application",
    description: "Design intuitive and accessible mobile app interface for healthcare application. Focus on user-friendly design for elderly patients.",
    budget: "3200",
    duration: "4-5 weeks",
    experienceLevel: "Intermediate",
    category: "UI/UX Design",
    skills: ["Mobile Design", "Accessibility", "Healthcare UX", "Sketch", "InVision"],
    client: { name: "HealthCare Plus" },
    proposalCount: 9,
    createdAt: new Date("2024-06-13")
  },
  // Data Science Projects
  {
    id: 9,
    title: "Machine Learning Model for Customer Churn Prediction",
    description: "Build and deploy ML model to predict customer churn. Need data analysis, feature engineering, model training, and deployment with API endpoint.",
    budget: "6800",
    duration: "8-10 weeks",
    experienceLevel: "Expert",
    category: "Data Science",
    skills: ["Python", "Scikit-learn", "TensorFlow", "Pandas", "FastAPI"],
    client: { name: "RetailAnalytics Corp" },
    proposalCount: 4,
    createdAt: new Date("2024-06-12")
  },
  {
    id: 10,
    title: "Business Intelligence Dashboard with Real-time Analytics",
    description: "Create comprehensive BI dashboard with real-time data visualization, automated reporting, and predictive analytics for sales data.",
    budget: "8900",
    duration: "10-12 weeks",
    experienceLevel: "Expert",
    category: "Data Science",
    skills: ["Tableau", "Power BI", "SQL", "Python", "ETL"],
    client: { name: "DataDriven Enterprises" },
    proposalCount: 6,
    createdAt: new Date("2024-06-11")
  },
  // Marketing Projects
  {
    id: 11,
    title: "Digital Marketing Campaign for Product Launch",
    description: "Develop comprehensive digital marketing strategy including SEO, social media campaigns, content marketing, and paid advertising for new product launch.",
    budget: "2500",
    duration: "6-8 weeks",
    experienceLevel: "Intermediate",
    category: "Marketing",
    skills: ["SEO", "Social Media Marketing", "Google Ads", "Content Strategy", "Analytics"],
    client: { name: "StartupLaunch Inc" },
    proposalCount: 11,
    createdAt: new Date("2024-06-10")
  },
  {
    id: 12,
    title: "Email Marketing Automation and Lead Generation",
    description: "Set up email marketing automation workflows, create lead magnets, and implement conversion optimization strategies for B2B SaaS company.",
    budget: "1800",
    duration: "4-6 weeks",
    experienceLevel: "Intermediate",
    category: "Marketing",
    skills: ["Email Marketing", "Marketing Automation", "Lead Generation", "A/B Testing", "CRM"],
    client: { name: "SaaS Growth Co" },
    proposalCount: 8,
    createdAt: new Date("2024-06-09")
  },
  // Writing Projects
  {
    id: 13,
    title: "Technical Documentation for API and Developer Guides",
    description: "Write comprehensive technical documentation including API reference, developer tutorials, and integration guides for software platform.",
    budget: "3500",
    duration: "6-7 weeks",
    experienceLevel: "Intermediate",
    category: "Writing",
    skills: ["Technical Writing", "API Documentation", "Markdown", "Git", "Software Documentation"],
    client: { name: "DevTools Platform" },
    proposalCount: 7,
    createdAt: new Date("2024-06-08")
  },
  {
    id: 14,
    title: "Content Writing for Technology Blog and Website",
    description: "Create high-quality blog posts, website copy, and marketing content focused on emerging technologies, AI, and software development trends.",
    budget: "2200",
    duration: "8 weeks",
    experienceLevel: "Intermediate",
    category: "Writing",
    skills: ["Content Writing", "SEO Writing", "Technology Writing", "Copywriting", "Research"],
    client: { name: "Tech Insights Media" },
    proposalCount: 13,
    createdAt: new Date("2024-06-07")
  }
];

// Login Modal Component
const LoginModal = ({ isOpen, onClose }) => {
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (signIn(formData)) {
      onClose();
      setFormData({ name: '', email: '' });
    } else {
      setError('Invalid credentials. Use password: sbworks123');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>Sign In to SB Works</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
          />
          <div className="password-info">
            <p>Password: sbworks123 (same for all users)</p>
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="modal-actions">
            <button type="submit" className="btn btn-primary">Sign In</button>
            <button type="button" onClick={onClose} className="btn btn-outline">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// SignUp Modal Component
const SignUpModal = ({ isOpen, onClose }) => {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', role: 'freelancer' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (signUp(formData)) {
      onClose();
      setFormData({ name: '', email: '', role: 'freelancer' });
    } else {
      setError('User with this email already exists');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>Join SB Works</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
          />
          <select 
            value={formData.role} 
            onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
          >
            <option value="freelancer">I want to work (Freelancer)</option>
            <option value="client">I want to hire (Client)</option>
          </select>
          <div className="password-info">
            <p>Default password: sbworks123</p>
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="modal-actions">
            <button type="submit" className="btn btn-primary">Sign Up</button>
            <button type="button" onClick={onClose} className="btn btn-outline">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Apply Modal Component
const ApplyModal = ({ isOpen, onClose, project, onApply }) => {
  const [formData, setFormData] = useState({ 
    coverLetter: '', 
    proposedBudget: '', 
    timeline: '' 
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onApply(project.title, project.client.name);
    onClose();
    setFormData({ coverLetter: '', proposedBudget: '', timeline: '' });
    alert('Application submitted successfully!');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal large" onClick={e => e.stopPropagation()}>
        <h2>Apply for Project</h2>
        <div className="project-summary">
          <h3>{project?.title}</h3>
          <p>{project?.description}</p>
          <div className="project-meta">
            <span>Budget: ${project?.budget}</span>
            <span>Duration: {project?.duration}</span>
            <span>Level: {project?.experienceLevel}</span>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Cover Letter - Explain why you're perfect for this project..."
            value={formData.coverLetter}
            onChange={(e) => setFormData(prev => ({ ...prev, coverLetter: e.target.value }))}
            rows={4}
            required
          />
          <input
            type="number"
            placeholder="Your Proposed Budget ($)"
            value={formData.proposedBudget}
            onChange={(e) => setFormData(prev => ({ ...prev, proposedBudget: e.target.value }))}
            required
          />
          <input
            type="text"
            placeholder="Delivery Timeline (e.g., 2-3 weeks)"
            value={formData.timeline}
            onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
            required
          />
          <div className="modal-actions">
            <button type="submit" className="btn btn-primary">Submit Application</button>
            <button type="button" onClick={onClose} className="btn btn-outline">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Header Component
const Header = ({ onNavigate, currentPage }) => {
  const { isSignedIn, user, signOut } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleNavigation = (page) => {
    onNavigate(page);
  };

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="logo" onClick={() => handleNavigation('home')}>
            <h1>SB Works</h1>
          </div>
          <nav className="nav">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); handleNavigation('home'); }} 
              className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
            >
              Browse Projects
            </a>
            {isSignedIn && (
              <>
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); handleNavigation('dashboard'); }} 
                  className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
                >
                  Dashboard
                </a>
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); handleNavigation('applications'); }} 
                  className={`nav-link ${currentPage === 'applications' ? 'active' : ''}`}
                >
                  Applications
                </a>
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); handleNavigation('my-applications'); }} 
                  className={`nav-link ${currentPage === 'my-applications' ? 'active' : ''}`}
                >
                  My Applications
                </a>
              </>
            )}
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); handleNavigation('how-it-works'); }} 
              className={`nav-link ${currentPage === 'how-it-works' ? 'active' : ''}`}
            >
              How it Works
            </a>
          </nav>
          <div className="auth-section">
            {isSignedIn ? (
              <div className="user-info">
                <span>Welcome, {user?.name}</span>
                <button onClick={signOut} className="btn btn-outline">Logout</button>
              </div>
            ) : (
              <div>
                <button onClick={() => setShowLogin(true)} className="btn btn-outline">Sign In</button>
                <button onClick={() => setShowSignUp(true)} className="btn btn-primary">Sign Up</button>
              </div>
            )}
          </div>
        </div>
      </header>
      <LoginModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)} 
      />
      <SignUpModal 
        isOpen={showSignUp} 
        onClose={() => setShowSignUp(false)} 
      />
    </>
  );
};

// Project Filters Component
const ProjectFilters = ({ onFilterChange, onSortChange, onViewModeChange, viewMode, sortBy, activeCategory }) => {
  const [showFilters, setShowFilters] = useState(false);
  
  const categories = [
    "All Categories",
    "Web Development", 
    "Mobile Apps",
    "UI/UX Design",
    "Data Science",
    "DevOps",
    "Marketing",
    "Writing"
  ];
  
  const experienceLevels = ["All Levels", "Entry Level", "Intermediate", "Expert"];
  const budgetRanges = ["All Budgets", "$1,000-$3,000", "$3,000-$7,000", "$7,000-$12,000", "$12,000+"];
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "budget-high", label: "Highest Budget" },
    { value: "budget-low", label: "Lowest Budget" },
    { value: "proposals", label: "Most Proposals" }
  ];

  return (
    <div className="filters-section">
      <div className="filters-header">
        <div className="filters-left">
          <h2>Browse Projects</h2>
          <p>Find the perfect project for your skills</p>
        </div>
        <div className="filters-right">
          <button 
            className="btn btn-outline mobile-filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters {showFilters ? '−' : '+'}
          </button>
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => onViewModeChange('grid')}
            >
              Grid
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => onViewModeChange('list')}
            >
              List
            </button>
          </div>
        </div>
      </div>

      <div className={`filters-content ${showFilters ? 'show' : ''}`}>
        <div className="filter-group">
          <label>Category</label>
          <select onChange={(e) => onFilterChange({ category: e.target.value === 'All Categories' ? '' : e.target.value })}>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Experience Level</label>
          <select onChange={(e) => onFilterChange({ experienceLevel: e.target.value === 'All Levels' ? '' : e.target.value })}>
            {experienceLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Budget Range</label>
          <select onChange={(e) => onFilterChange({ budget: e.target.value === 'All Budgets' ? '' : e.target.value })}>
            {budgetRanges.map(range => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Sort By</label>
          <select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <button className="btn btn-outline" onClick={() => {
            onFilterChange({ category: '', experienceLevel: '', budget: '' });
            onSortChange('newest');
          }}>
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};

// Search Hero Component
const SearchHero = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    "All Categories",
    "Web Development", 
    "Mobile Apps",
    "UI/UX Design",
    "Data Science",
    "DevOps",
    "Marketing",
    "Writing"
  ];

  const handleSearch = () => {
    onSearch(searchTerm, selectedCategory === 'All Categories' ? '' : selectedCategory);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-hero">
      <div className="container">
        <h1>Find Your Perfect Project</h1>
        <p>Connect with amazing freelance opportunities</p>
        <div className="search-container">
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Search for projects, skills, or keywords..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button className="btn btn-primary" onClick={handleSearch}>
              Search Projects
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Project Card Component
const ProjectCard = ({ project, onApply, viewMode = 'grid' }) => {
  const { isSignedIn } = useAuth();
  const [showApplyModal, setShowApplyModal] = useState(false);

  const handleApplyClick = () => {
    if (!isSignedIn) {
      alert('Please sign in to apply for projects');
      return;
    }
    setShowApplyModal(true);
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffInHours = Math.floor((now - posted) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  if (viewMode === 'list') {
    return (
      <>
        <div className="project-card list-view">
          <div className="project-main">
            <div className="project-header">
              <h3>{project.title}</h3>
              <div className="project-actions">
                <span className="posted-time">{formatTimeAgo(project.createdAt)}</span>
                <button className="btn btn-primary" onClick={handleApplyClick}>
                  Apply Now
                </button>
              </div>
            </div>
            <p className="project-description">{project.description}</p>
            <div className="project-details">
              <div className="detail-item">
                <strong>Budget:</strong> ${parseInt(project.budget).toLocaleString()}
              </div>
              <div className="detail-item">
                <strong>Duration:</strong> {project.duration}
              </div>
              <div className="detail-item">
                <strong>Level:</strong> {project.experienceLevel}
              </div>
              <div className="detail-item">
                <strong>Proposals:</strong> {project.proposalCount}
              </div>
            </div>
            <div className="skills">
              {project.skills.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        </div>
        <ApplyModal
          isOpen={showApplyModal}
          onClose={() => setShowApplyModal(false)}
          project={project}
          onApply={onApply}
        />
      </>
    );
  }

  return (
    <>
      <div className="project-card grid-view">
        <div className="card-header">
          <h3>{project.title}</h3>
          <span className="posted-time">{formatTimeAgo(project.createdAt)}</span>
        </div>
        <p className="project-description">{project.description}</p>
        <div className="project-meta">
          <span className="budget">${parseInt(project.budget).toLocaleString()}</span>
          <span className="level">{project.experienceLevel} Level</span>
          <span className="duration">{project.duration}</span>
        </div>
        <div className="skills">
          {project.skills.slice(0, 4).map((skill, index) => (
            <span key={index} className="skill-tag">{skill}</span>
          ))}
          {project.skills.length > 4 && (
            <span className="skill-tag more">+{project.skills.length - 4} more</span>
          )}
        </div>
        <div className="project-footer">
          <div className="project-stats">
            <span className="proposals">{project.proposalCount} proposals</span>
            <span className="client">by {project.client.name}</span>
          </div>
          <button className="btn btn-primary" onClick={handleApplyClick}>
            Apply Now
          </button>
        </div>
      </div>
      <ApplyModal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        project={project}
        onApply={onApply}
      />
    </>
  );
};

// Profile Modal Component
const ProfileModal = ({ isOpen, onClose, user, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    skills: '',
    description: 'I am a student and a web developer with skills in MERN stack'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        skills: '',
        description: user.description || 'I am a student and a web developer with skills in MERN stack'
      });
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
    alert('Profile updated successfully!');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>Update Profile</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
          />
          <input
            type="text"
            placeholder="Skills (comma separated)"
            value={formData.skills}
            onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
          />
          <div className="modal-actions">
            <button type="submit" className="btn btn-primary">Update Profile</button>
            <button type="button" onClick={onClose} className="btn btn-outline">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
  const { user } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleProfileUpdate = (updatedData) => {
    // In a real app, this would update the user in the database
    console.log('Profile update:', updatedData);
  };

  if (!user) {
    return (
      <div className="dashboard">
        <div className="container">
          <h1>Please sign in to access dashboard</h1>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="dashboard">
        <div className="container">
          <h1>Welcome back, {user.name}!</h1>
          
          <div className="stats-grid">
            <div className="stat-card">
              <h3>0</h3>
              <p>Current projects</p>
              <button className="btn btn-outline">View projects</button>
            </div>
            
            <div className="stat-card">
              <h3>{user.projectsCompleted}</h3>
              <p>Completed projects</p>
              <button className="btn btn-outline">View projects</button>
            </div>
            
            <div className="stat-card">
              <h3>{user.applicationsSent}</h3>
              <p>Applications</p>
              <button className="btn btn-outline">View Applications</button>
            </div>
            
            <div className="stat-card">
              <h3>${user.totalEarnings.toLocaleString()}</h3>
              <p>Funds</p>
              <p className="small">Available: ${user.totalEarnings.toLocaleString()}</p>
            </div>
          </div>

          <div className="skills-section">
            <h2>My Skills</h2>
            <div className="skills">
              <span className="skill-badge python">Python</span>
              <span className="skill-badge javascript">JavaScript</span>
              <span className="skill-badge react">React.js</span>
              <span className="skill-badge node">Node.js</span>
              <span className="skill-badge mongo">MongoDB</span>
              <span className="skill-badge express">Express.js</span>
            </div>
          </div>

          <div className="description-section">
            <h2>Description</h2>
            <p>{user.description || 'I am a student and a web developer with skills in MERN stack'}</p>
            <button 
              className="btn btn-outline"
              onClick={() => setShowProfileModal(true)}
            >
              Update
            </button>
          </div>

          <div className="actions">
            <button 
              className="btn btn-primary" 
              onClick={() => window.location.reload()}
            >
              Browse New Projects
            </button>
            <button 
              className="btn btn-outline"
              onClick={() => setShowProfileModal(true)}
            >
              Update Profile
            </button>
          </div>
        </div>
      </div>
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={user}
        onUpdate={handleProfileUpdate}
      />
    </>
  );
};

// Applications Component
const Applications = () => {
  const { applications, user } = useAuth();

  if (!user) {
    return (
      <div className="applications">
        <div className="container">
          <h1>Please sign in to view applications</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="applications">
      <div className="container">
        <h1>My Applications</h1>
        <p>Track and manage all your project applications</p>

        {applications.length > 0 ? (
          <div className="applications-list">
            {applications.map((app) => (
              <div key={app.id} className="application-card">
                <h3>{app.projectTitle}</h3>
                <p>Client: {app.client}</p>
                <div className="application-meta">
                  <span>Applied: {app.appliedDate}</span>
                  <span className={`status ${app.status}`}>{app.status}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No applications yet</h3>
            <p>Start applying to projects to see your applications here</p>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>Browse Projects</button>
          </div>
        )}
      </div>
    </div>
  );
};

// My Applications Component with fixed cursor movement
const MyApplications = () => {
  const { user, applications } = useAuth();
  const [activeTab, setActiveTab] = useState('active');

  if (!user) {
    return (
      <div className="my-applications">
        <div className="container">
          <h1>Please sign in to view your applications</h1>
        </div>
      </div>
    );
  }

  const activeProjects = user.projectsCompleted > 0 ? [
    {
      id: 1,
      title: "E-commerce Dashboard Development",
      client: "TechCorp Solutions",
      budget: "$4,500",
      deadline: "Dec 30, 2024",
      progress: 75,
      status: "in_progress",
      description: "Building a comprehensive admin dashboard for e-commerce platform"
    }
  ] : [];

  const completedProjects = user.projectsCompleted > 0 ? [
    {
      id: 1,
      title: "Restaurant Website",
      client: "Bella Vista Restaurant",
      budget: "$2,800",
      completedDate: "Nov 15, 2024",
      rating: 5,
      review: "Excellent work! Very professional and delivered on time.",
      earnings: 2800
    }
  ] : [];

  const tabData = {
    active: { label: `Active Projects (${activeProjects.length})`, content: activeProjects },
    completed: { label: `Completed Projects (${completedProjects.length})`, content: completedProjects },
    applications: { label: `Applications (${applications.length})`, content: applications }
  };

  return (
    <div className="my-applications">
      <div className="container">
        <h1>My Projects</h1>

        <div className="tabs">
          {Object.entries(tabData).map(([key, data]) => (
            <button
              key={key}
              className={`tab ${activeTab === key ? 'active' : ''}`}
              onClick={() => setActiveTab(key)}
            >
              {data.label}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {activeTab === 'active' && (
            <div className="projects-section">
              <h2>Active Projects</h2>
              {activeProjects.length > 0 ? (
                <div className="projects-list">
                  {activeProjects.map((project) => (
                    <div key={project.id} className="project-card-detailed">
                      <div className="project-header">
                        <div className="project-info">
                          <h3>{project.title}</h3>
                          <p>{project.description}</p>
                          <p>Client: {project.client}</p>
                        </div>
                        <div className="project-status">
                          <span className="status in-progress">In Progress</span>
                        </div>
                      </div>
                      <div className="project-details">
                        <div className="detail">
                          <span>Budget</span>
                          <p>{project.budget}</p>
                        </div>
                        <div className="detail">
                          <span>Deadline</span>
                          <p>{project.deadline}</p>
                        </div>
                        <div className="detail">
                          <span>Progress</span>
                          <p>{project.progress}%</p>
                        </div>
                      </div>
                      <div className="progress-bar">
                        <div className="progress" style={{ width: `${project.progress}%` }}></div>
                      </div>
                      <div className="project-actions">
                        <button className="btn btn-primary">View Details</button>
                        <button className="btn btn-outline">Message Client</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <h3>No active projects</h3>
                  <p>Apply to projects to start working and earning</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'completed' && (
            <div className="projects-section">
              <h2>Completed Projects</h2>
              {completedProjects.length > 0 ? (
                <div className="projects-list">
                  {completedProjects.map((project) => (
                    <div key={project.id} className="project-card-detailed">
                      <div className="project-header">
                        <div className="project-info">
                          <h3>{project.title}</h3>
                          <p>Client: {project.client}</p>
                          <p>Completed: {project.completedDate}</p>
                        </div>
                        <div className="project-rating">
                          <div className="stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star} className={star <= project.rating ? 'star filled' : 'star'}>★</span>
                            ))}
                          </div>
                          <span>{project.rating}/5</span>
                        </div>
                      </div>
                      <div className="project-details">
                        <div className="detail">
                          <span>Budget</span>
                          <p>{project.budget}</p>
                        </div>
                        <div className="detail">
                          <span>Earnings</span>
                          <p className="earnings">${project.earnings.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="review">
                        <p>"{project.review}"</p>
                      </div>
                      <button className="btn btn-outline">View Project</button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <h3>No completed projects yet</h3>
                  <p>Complete your first project to see it here</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="projects-section">
              <h2>My Applications</h2>
              {applications.length > 0 ? (
                <div className="applications-list">
                  {applications.map((app) => (
                    <div key={app.id} className="application-card">
                      <h3>{app.projectTitle}</h3>
                      <p>Client: {app.client}</p>
                      <div className="application-meta">
                        <span>Applied: {app.appliedDate}</span>
                        <span className={`status ${app.status}`}>{app.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <h3>No applications yet</h3>
                  <p>Start applying to projects to see your applications here</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// How It Works Component (simplified for freelancers only)
const HowItWorks = () => {
  return (
    <div className="how-it-works">
      <div className="container">
        <div className="hero-section">
          <h1>How SB Works Functions</h1>
          <p>Join thousands of freelancers who trust our platform to find amazing projects</p>
        </div>

        <div className="section">
          <h2>For Freelancers</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Create Your Profile</h3>
              <p>Set up your professional profile, showcase your skills, and highlight your experience to attract potential clients.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Browse Projects</h3>
              <p>Explore thousands of projects across different categories. Filter by budget, timeline, and skill requirements.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Submit Proposals</h3>
              <p>Write compelling proposals that showcase your understanding of the project and your unique approach.</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Get Hired</h3>
              <p>Once selected, collaborate with clients, deliver quality work, and build lasting professional relationships.</p>
            </div>
          </div>
        </div>

        <div className="benefits-section">
          <h2>Why Choose SB Works?</h2>
          <div className="benefits">
            <div className="benefit">
              <h3>Secure Payments</h3>
              <p>Protected transactions with milestone-based payments and dispute resolution.</p>
            </div>
            <div className="benefit">
              <h3>Quality Projects</h3>
              <p>Verified clients and comprehensive project screening ensure quality opportunities.</p>
            </div>
            <div className="benefit">
              <h3>24/7 Support</h3>
              <p>Round-the-clock customer support to help resolve any issues quickly.</p>
            </div>
            <div className="benefit">
              <h3>Global Reach</h3>
              <p>Connect with clients from around the world, across all time zones and industries.</p>
            </div>
          </div>
        </div>

        <div className="cta-section">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of successful freelancers on SB Works</p>
          <div className="cta-buttons">
            <button className="btn btn-primary">Start as Freelancer</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Home Component
const Home = () => {
  const { addApplication } = useAuth();
  const [allProjects] = useState(mockProjects);
  const [filteredProjects, setFilteredProjects] = useState(mockProjects);
  const [filters, setFilters] = useState({
    category: '',
    experienceLevel: '',
    budget: '',
    search: ''
  });
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');

  const handleApply = (projectTitle, client) => {
    addApplication(projectTitle, client);
  };

  const handleSearch = (searchTerm, category) => {
    setFilters(prev => ({ ...prev, search: searchTerm, category }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...allProjects];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower) ||
        project.skills.some(skill => skill.toLowerCase().includes(searchLower))
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(project => project.category === filters.category);
    }

    // Apply experience level filter
    if (filters.experienceLevel) {
      filtered = filtered.filter(project => project.experienceLevel === filters.experienceLevel);
    }

    // Apply budget filter
    if (filters.budget) {
      filtered = filtered.filter(project => {
        const budget = parseInt(project.budget);
        switch (filters.budget) {
          case '$1,000-$3,000':
            return budget >= 1000 && budget <= 3000;
          case '$3,000-$7,000':
            return budget >= 3000 && budget <= 7000;
          case '$7,000-$12,000':
            return budget >= 7000 && budget <= 12000;
          case '$12,000+':
            return budget >= 12000;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'budget-high':
          return parseInt(b.budget) - parseInt(a.budget);
        case 'budget-low':
          return parseInt(a.budget) - parseInt(b.budget);
        case 'proposals':
          return b.proposalCount - a.proposalCount;
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    setFilteredProjects(filtered);
  }, [filters, sortBy, allProjects]);

  return (
    <div className="home">
      <SearchHero onSearch={handleSearch} />

      <div className="stats">
        <div className="container">
          <div className="stat">
            <h3>8,421</h3>
            <p>Happy Clients</p>
          </div>
          <div className="stat">
            <h3>$12.5M+</h3>
            <p>Platform Earnings</p>
          </div>
        </div>
      </div>

      <div className="projects-section">
        <div className="container">
          <ProjectFilters 
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
            onViewModeChange={handleViewModeChange}
            viewMode={viewMode}
            sortBy={sortBy}
            activeCategory={filters.category}
          />
          
          <div className="projects-results">
            <div className="results-header">
              <p>{filteredProjects.length} projects found</p>
            </div>
            
            <div className={`project-grid ${viewMode}`}>
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                    onApply={handleApply}
                    viewMode={viewMode}
                  />
                ))
              ) : (
                <div className="no-results">
                  <h3>No projects found</h3>
                  <p>Try adjusting your filters or search terms</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      setFilters({ category: '', experienceLevel: '', budget: '', search: '' });
                      setSortBy('newest');
                    }}
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'applications':
        return <Applications />;
      case 'my-applications':
        return <MyApplications />;
      case 'how-it-works':
        return <HowItWorks />;
      default:
        return <Home />;
    }
  };

  return (
    <AuthProvider>
      <div className="App">
        <Header onNavigate={setCurrentPage} currentPage={currentPage} />
        <main>
          {renderPage()}
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;