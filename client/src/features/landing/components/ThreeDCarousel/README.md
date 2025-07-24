# React 3D Carousel

A modern, reusable React component that converts the original Tympanus 3D carousel into a fully React-ified component with scroll-based animations and GSAP integration.

## Features

- 🎯 **Fully React-ified**: No direct DOM manipulation, uses React hooks and refs
- 🎨 **Scroll-based animations**: Smooth 3D rotations and perspective transformations
- 📱 **Responsive design**: Works on all screen sizes
- ⚡ **Performance optimized**: Uses GSAP for smooth animations
- 🎭 **Customizable**: Configurable radius, titles, and image arrays
- 🔧 **TypeScript ready**: Easy to add TypeScript support
- 🎪 **Interactive**: Click handlers for images

## Installation

```bash
npm install react react-dom gsap @gsap/react
```

## Usage

### Basic Usage

```jsx
import ThreeDCarousel from './ThreeDCarousel';

const App = () => {
  const images = [
    '/path/to/image1.jpg',
    '/path/to/image2.jpg',
    '/path/to/image3.jpg',
    '/path/to/image4.jpg'
  ];

  return (
    <ThreeDCarousel
      images={images}
      title="My 3D Carousel"
      radius={500}
      onImageClick={(image, index) => console.log('Clicked:', image, index)}
    />
  );
};
```

### Advanced Usage with Multiple Carousels

```jsx
import ThreeDCarousel from './ThreeDCarousel';

const App = () => {
  const carouselData = [
    {
      title: "Fashion Collection 1",
      images: ['/img1.jpg', '/img2.jpg', '/img3.jpg', '/img4.jpg'],
      radius: 500
    },
    {
      title: "Fashion Collection 2", 
      images: ['/img5.jpg', '/img6.jpg', '/img7.jpg', '/img8.jpg'],
      radius: 650
    }
  ];

  const handleImageClick = (image, index) => {
    console.log('Image clicked:', image, 'Index:', index);
  };

  return (
    <div>
      {carouselData.map((carousel, index) => (
        <ThreeDCarousel
          key={index}
          title={carousel.title}
          images={carousel.images}
          radius={carousel.radius}
          onImageClick={handleImageClick}
        />
      ))}
    </div>
  );
};
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `images` | `string[]` | `[]` | Array of image URLs to display in the carousel |
| `title` | `string` | `"3D Carousel"` | Title displayed above the carousel |
| `radius` | `number` | `500` | Radius of the 3D carousel circle (in pixels) |
| `className` | `string` | `""` | Additional CSS classes for the scene container |
| `onImageClick` | `function` | `null` | Callback function when an image is clicked |

## Development

### Running the Demo

```bash
npm run dev
```

This will start the development server at `http://localhost:3000` with a demo showcasing multiple carousels.

### Building

```bash
npm run build
```

### Preview Build

```bash
npm run preview
```

## Component Structure

```
ThreeDCarousel/
├── src/
│   ├── ThreeDCarousel.jsx    # Main component
│   ├── ThreeDCarousel.css    # Component styles
│   ├── App.jsx               # Demo application
│   ├── App.css               # Demo styles
│   ├── main.jsx              # Entry point
│   └── index.css             # Base styles
├── public/
│   └── assets/               # Image assets
├── package.json
├── vite.config.js
└── README.md
```

## Key Features Explained

### React Hooks Integration

- **useRef**: Used for DOM element references (scene, carousel, title)
- **useState**: Manages animation state and GSAP instances
- **useEffect**: Handles initialization and cleanup of animations

### GSAP Integration

The component uses several GSAP plugins:
- **ScrollTrigger**: For scroll-based animations
- **ScrollSmoother**: For smooth scrolling effects
- **SplitText**: For character-level text animations
- **ScrollToPlugin**: For programmatic scrolling

### 3D Transformations

The carousel uses CSS 3D transforms:
- `perspective`: Creates 3D space
- `transform-style: preserve-3d`: Maintains 3D positioning
- `rotateY()` and `translateZ()`: Positions cards in 3D space

### Responsive Design

The component includes responsive breakpoints:
- Desktop: Full size carousel
- Tablet (768px): Reduced size
- Mobile (480px): Further reduced size

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

ISC

## Credits

Original carousel design by [Tympanus](https://tympanus.net/codrops/2023/03/15/on-scroll-3d-carousel/). 