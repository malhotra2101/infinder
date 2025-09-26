# Landing Page

This folder contains all the components and styles related to the landing page of the application.

## Structure

```
pages/landing-page/
├── components/           # Landing page specific components
│   ├── Hero/            # Hero section with 3D cube
│   ├── Cube/            # 3D cube component
│   ├── About.jsx        # About section component
│   ├── Contact.jsx      # Contact section component
│   ├── Services.jsx     # Services section component
│   ├── Showcase.jsx     # Showcase section component
│   ├── Footer.jsx       # Footer component
│   └── index.js         # Component exports
├── styles/              # Landing page specific styles
│   ├── *.module.css     # CSS modules for components
│   └── index.js         # Style exports
├── LandingPage.jsx      # Main landing page component
├── index.js             # Landing page export
└── README.md           # This file
```

## Components

### Hero
The main hero section featuring an interactive 3D cube and call-to-action buttons.

### Cube
A 3D cube component with interactive rotation and face detection.

### About, Contact, Services, Showcase, Footer
Section components for the landing page content.

## Usage

```jsx
import LandingPage from './pages/landing-page';
// or
import { Hero, Cube } from './pages/landing-page/components';
```

## Styles

All landing page styles are CSS modules located in the `styles/` folder and can be imported as needed.

```jsx
import { AboutStyles, ContactStyles } from './pages/landing-page/styles';
``` 