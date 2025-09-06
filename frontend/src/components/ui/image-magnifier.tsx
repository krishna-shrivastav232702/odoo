import React, { useState, useRef, useEffect } from 'react';

interface ImageMagnifierProps {
  src: string;
  alt: string;
  className?: string;
  magnifierSize?: number;
  zoomLevel?: number;
}

export const ImageMagnifier: React.FC<ImageMagnifierProps> = ({
  src,
  alt,
  className = '',
  magnifierSize = 150,
  zoomLevel = 2,
}) => {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPos, setMagnifierPos] = useState({ x: 0, y: 0 });
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });
  const [naturalDimensions, setNaturalDimensions] = useState({ width: 0, height: 0 });
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setNaturalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = src;
  }, [src]);

  const handleMouseEnter = () => {
    if (imgRef.current) {
      const rect = imgRef.current.getBoundingClientRect();
      setImgDimensions({ width: rect.width, height: rect.height });
      setShowMagnifier(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const imgRect = imgRef.current.getBoundingClientRect();
    
    // Mouse position relative to the container
    const x = e.clientX - containerRect.left;
    const y = e.clientY - containerRect.top;
    
    // Mouse position relative to the actual image
    const imgX = e.clientX - imgRect.left;
    const imgY = e.clientY - imgRect.top;
    
    // Keep magnifier within container bounds
    const magnifierX = Math.max(0, Math.min(x - magnifierSize / 2, containerRect.width - magnifierSize));
    const magnifierY = Math.max(0, Math.min(y - magnifierSize / 2, containerRect.height - magnifierSize));
    
    setMagnifierPos({ x: magnifierX, y: magnifierY });
    
    // Update magnifier background position
    const magnifier = document.getElementById('magnifier');
    if (magnifier && imgX >= 0 && imgY >= 0 && imgX <= imgRect.width && imgY <= imgRect.height) {
      // Calculate the percentage position on the image
      const xPercent = (imgX / imgRect.width) * 100;
      const yPercent = (imgY / imgRect.height) * 100;
      
      magnifier.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
    }
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  return (
    <div 
      ref={containerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="w-full h-full object-cover cursor-crosshair select-none"
        draggable={false}
      />
      
      {showMagnifier && (
        <div
          id="magnifier"
          className="absolute border-2 border-white shadow-xl rounded-full pointer-events-none z-50 overflow-hidden"
          style={{
            left: `${magnifierPos.x}px`,
            top: `${magnifierPos.y}px`,
            width: `${magnifierSize}px`,
            height: `${magnifierSize}px`,
            backgroundImage: `url(${src})`,
            backgroundSize: `${zoomLevel * 100}% ${zoomLevel * 100}%`,
            backgroundRepeat: 'no-repeat',
            opacity: 1,
            transition: 'opacity 0.15s ease-out',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.2)',
          }}
        />
      )}
    </div>
  );
};