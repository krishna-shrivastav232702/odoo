import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ImageMagnifierProps {
  src: string;
  alt: string;
  magnifierSize?: number;
  zoomLevel?: number;
  className?: string;
}

export const ImageMagnifier: React.FC<ImageMagnifierProps> = ({
  src,
  alt,
  magnifierSize = 150,
  zoomLevel = 2,
  className = ''
}) => {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
  const imgRef = useRef<HTMLImageElement>(null);

  const handleMouseEnter = () => {
    if (imgRef.current) {
      const { width, height } = imgRef.current.getBoundingClientRect();
      setImgSize({ width, height });
      setShowMagnifier(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imgRef.current) return;

    const { left, top } = imgRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    setMagnifierPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="w-full h-full object-cover cursor-crosshair"
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />

      {showMagnifier && (
        <div
          className="absolute border-2 border-white shadow-lg rounded-full pointer-events-none z-10"
          style={{
            width: magnifierSize,
            height: magnifierSize,
            left: magnifierPosition.x - magnifierSize / 2,
            top: magnifierPosition.y - magnifierSize / 2,
            backgroundImage: `url(${src})`,
            backgroundSize: `${imgSize.width * zoomLevel}px ${imgSize.height * zoomLevel}px`,
            backgroundPosition: `-${magnifierPosition.x * zoomLevel - magnifierSize / 2}px -${magnifierPosition.y * zoomLevel - magnifierSize / 2}px`,
            backgroundRepeat: 'no-repeat',
          }}
        />
      )}
    </div>
  );
};