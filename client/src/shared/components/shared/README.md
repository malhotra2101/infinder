# Responsive Expandable Menu Components

This directory contains reusable React components for creating a responsive expandable menu with a burger-style toggle button.

## Components

### MenuToggle.jsx
A burger-style toggle button that displays a hamburger icon with "Menu" text.

**Props:**
- `isOpen` (boolean): Controls the open/closed state of the menu
- `onToggle` (function): Callback function called when the button is clicked

**Features:**
- Animated hamburger icon that transforms to an X when open
- "Menu" text label
- Responsive design
- Hover effects and smooth transitions
- Accessible with proper ARIA attributes

### MenuDrawer.jsx
An expandable menu drawer that slides in from the right side of the screen.

**Props:**
- `isOpen` (boolean): Controls the visibility of the drawer
- `onClose` (function): Callback function called when the menu should close
- `menuItems` (array, optional): Array of menu items with `label` and `href` properties

**Features:**
- Smooth slide-in animation from the right
- Semi-transparent overlay background
- Click outside to close functionality
- ESC key to close
- Focus trapping for accessibility
- Responsive design
- Animated menu items with staggered entrance
- Close button in the top-right corner

## Usage Example

```jsx
import React, { useState } from 'react';
import MenuToggle from './components/MenuToggle';
import MenuDrawer from './components/MenuDrawer';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  // Optional: Custom menu items
  const menuItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Contact', href: '#contact' }
  ];

  return (
    <div className="App">
      {/* Menu Toggle Button */}
      <MenuToggle 
        isOpen={isMenuOpen} 
        onToggle={handleToggleMenu} 
      />
      
      {/* Menu Drawer */}
      <MenuDrawer 
        isOpen={isMenuOpen}
        onClose={handleCloseMenu}
        menuItems={menuItems} // Optional - will use defaults if not provided
      />

      {/* Your app content */}
      <main>
        <h1>Your App Content</h1>
        <p>Click the "Menu" button in the top-right corner!</p>
      </main>
    </div>
  );
}
```

## Styling

The components use vanilla CSS with the following files:
- `MenuToggle.css`: Styles for the toggle button
- `MenuDrawer.css`: Styles for the drawer and overlay

### Customization

You can customize the appearance by modifying the CSS files:

**Menu Toggle Position:**
```css
.menu-toggle {
  position: fixed;
  top: 2rem; /* Adjust top position */
  right: 2rem; /* Change to 'left' for left positioning */
}
```

**Menu Drawer Width:**
```css
.menu-drawer {
  width: 400px; /* Adjust width */
  max-width: 90vw; /* Adjust max width */
}
```

**Colors:**
```css
.menu-drawer {
  background: #1a1a1a; /* Change background color */
}

.menu-drawer-link {
  color: white; /* Change text color */
}
```

## Accessibility Features

- **Keyboard Navigation**: ESC key closes the menu
- **Focus Management**: Focus is trapped inside the menu when open
- **ARIA Attributes**: Proper `aria-label`, `aria-expanded`, and `aria-modal` attributes
- **Screen Reader Support**: Semantic HTML structure
- **Focus Indicators**: Visible focus outlines for keyboard users

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- Mobile browsers (iOS Safari, Chrome Mobile)
- Desktop browsers (Chrome, Firefox, Safari, Edge)

## Performance

- Uses CSS transforms for smooth animations
- Efficient event handling with proper cleanup
- Minimal re-renders with React best practices
- Responsive design with CSS media queries

## Demo

See `MenuDemo.jsx` for a complete working example of both components in action. 