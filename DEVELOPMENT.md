# Development Guide - Infinder

This guide provides detailed information about the project architecture, coding standards, and development workflow for the Infinder influencer marketing platform.

## 🏗️ Architecture Overview

### Monorepo Structure
```
infinder/
├── client/          # React frontend (Port 3001)
├── server/          # Express backend (Port 5050)
└── shared/          # Shared utilities (future)
```

### Technology Stack
- **Frontend**: React 19 + Vite + Modern CSS
- **Backend**: Express.js + Supabase + Security middleware
- **Package Manager**: PNPM with workspaces
- **Code Quality**: ESLint + Prettier + PropTypes

## 📝 Coding Standards

### JavaScript/React Standards

#### Component Structure
```jsx
/**
 * Component Name - Brief Description
 * 
 * Detailed description of the component's purpose and functionality.
 * Include information about props, state, and side effects.
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Component title
 * @param {Function} props.onClick - Click handler
 * @returns {JSX.Element} The rendered component
 */
import React from 'react';
import PropTypes from 'prop-types';
import './ComponentName.css';

const ComponentName = ({ title, onClick, children }) => {
  // State and hooks at the top
  const [state, setState] = useState(null);
  
  // Event handlers
  const handleClick = (event) => {
    // Handler logic
    onClick?.(event);
  };
  
  // Render method
  return (
    <div className="component-name">
      <h2>{title}</h2>
      {children}
    </div>
  );
};

// PropTypes for type checking
ComponentName.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  children: PropTypes.node
};

ComponentName.defaultProps = {
  onClick: () => {}
};

export default ComponentName;
```

#### CSS Standards
```css
/**
 * Component Name Styles
 * 
 * This file contains styles for the ComponentName component.
 * Uses BEM methodology for class naming.
 */

/* Base component */
.component-name {
  /* Base styles */
}

/* Modifiers */
.component-name--variant {
  /* Variant styles */
}

/* Elements */
.component-name__element {
  /* Element styles */
}

/* Responsive design */
@media (max-width: 768px) {
  .component-name {
    /* Mobile styles */
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .component-name {
    /* Reduced motion styles */
  }
}
```

### Backend Standards

#### Route Structure
```javascript
/**
 * Route Name - Brief Description
 * 
 * Detailed description of the route's purpose, parameters, and responses.
 * 
 * @route GET /api/endpoint
 * @param {string} req.query.param - Query parameter
 * @returns {Object} Response object
 */
app.get('/api/endpoint', async (req, res) => {
  try {
    // Route logic
    const result = await someFunction();
    
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Route error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
```

## 🔧 Development Workflow

### 1. Project Setup
```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev
```

### 2. Component Development
1. **Create component file** in appropriate directory
2. **Add PropTypes** for type checking
3. **Write CSS** following BEM methodology
4. **Test component** in isolation
5. **Integrate** with parent components

### 3. API Development
1. **Define route** in server/index.js
2. **Add error handling** and validation
3. **Test endpoint** with tools like Postman
4. **Update frontend** to consume new API

### 4. Styling Guidelines

#### CSS Organization
- **Global styles**: `src/index.css`
- **Component styles**: `ComponentName.css` in same directory
- **Utility classes**: Create reusable utility classes
- **Responsive design**: Mobile-first approach

#### Design System
```css
/* Color palette */
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --success-color: #48bb78;
  --error-color: #e53e3e;
  --warning-color: #f6ad55;
}

/* Typography */
:root {
  --font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  --font-size-base: 1rem;
  --line-height-base: 1.5;
}

/* Spacing */
:root {
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
}
```

## 🧪 Testing Strategy

### Frontend Testing
- **Component testing**: Test individual components
- **Integration testing**: Test component interactions
- **E2E testing**: Test complete user flows

### Backend Testing
- **Unit testing**: Test individual functions
- **Integration testing**: Test API endpoints
- **Database testing**: Test database operations

## 🔍 Debugging

### Frontend Debugging
```javascript
// Use React DevTools for component inspection
// Use browser DevTools for network and performance
// Use console.log for temporary debugging
console.log('Debug info:', { data, state });
```

### Backend Debugging
```javascript
// Use Morgan for request logging
// Use console.error for error logging
// Use environment variables for configuration
console.error('Server error:', error);
```

## 📦 Build and Deployment

### Development Build
```bash
# Frontend
cd client && pnpm dev

# Backend
cd server && pnpm dev
```

### Production Build
```bash
# Frontend
cd client && pnpm build

# Backend
cd server && pnpm start
```

## 🔒 Security Considerations

### Frontend Security
- **Input validation**: Validate all user inputs
- **XSS prevention**: Sanitize HTML content
- **CSRF protection**: Use CSRF tokens
- **Content Security Policy**: Implement CSP headers

### Backend Security
- **Helmet**: Security headers middleware
- **Rate limiting**: Prevent API abuse
- **Input validation**: Validate all inputs
- **Error handling**: Don't expose sensitive information

## 📚 Best Practices

### Code Organization
- **Separation of concerns**: Keep components focused
- **DRY principle**: Don't repeat yourself
- **Single responsibility**: Each function has one purpose
- **Meaningful names**: Use descriptive variable and function names

### Performance
- **Lazy loading**: Load components on demand
- **Code splitting**: Split bundles by route
- **Image optimization**: Compress and optimize images
- **Caching**: Implement appropriate caching strategies

### Accessibility
- **Semantic HTML**: Use proper HTML elements
- **ARIA labels**: Add accessibility attributes
- **Keyboard navigation**: Ensure keyboard accessibility
- **Color contrast**: Maintain sufficient color contrast

## 🚀 Deployment Checklist

### Frontend Deployment
- [ ] Run `pnpm build`
- [ ] Test production build locally
- [ ] Optimize images and assets
- [ ] Configure environment variables
- [ ] Deploy to hosting service

### Backend Deployment
- [ ] Set environment variables
- [ ] Configure database connection
- [ ] Set up SSL certificates
- [ ] Configure domain and DNS
- [ ] Set up monitoring and logging

## 📖 Additional Resources

- [React Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [Vite Documentation](https://vitejs.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [CSS BEM Methodology](https://en.bem.info/)

---

**Remember**: Always follow the established patterns and conventions in this project. When in doubt, refer to existing code for examples. 