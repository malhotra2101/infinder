import React from 'react';
import { useLazyImage } from '../hooks/useLazyLoad';

const LazyImage = ({ 
  src, 
  alt, 
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+',
  className = '',
  style = {},
  onLoad,
  onError,
  ...props 
}) => {
  const { imageSrc, imageRef, isLoaded, isInView } = useLazyImage(src, placeholder);

  const handleLoad = () => {
    if (onLoad) onLoad();
  };

  const handleError = () => {
    if (onError) onError();
  };

  return (
    <img
      ref={imageRef}
      src={imageSrc}
      alt={alt}
      className={`lazy-image ${isLoaded ? 'loaded' : 'loading'} ${className}`}
      style={{
        transition: 'opacity 0.3s ease-in-out',
        opacity: isLoaded ? 1 : 0.7,
        ...style
      }}
      onLoad={handleLoad}
      onError={handleError}
      {...props}
    />
  );
};

export default LazyImage; 