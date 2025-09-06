"use client";
import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface LensProps {
  children: React.ReactNode;
  lensSize?: number;
  zoomFactor?: number;
  hovering?: boolean;
  setHovering?: (hovering: boolean) => void;
  className?: string;
}

export const Lens: React.FC<LensProps> = ({
  children,
  lensSize = 150,
  zoomFactor = 2.5,
  hovering,
  setHovering,
  className,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const actualHovering = hovering !== undefined ? hovering : isHovering;
  const actualSetHovering = setHovering || setIsHovering;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPosition({ x, y });
  };

  const handleMouseEnter = () => {
    actualSetHovering(true);
  };

  const handleMouseLeave = () => {
    actualSetHovering(false);
  };

  // Get the image element from children
  const getImageSrc = () => {
    if (React.isValidElement(children) && children.props.src) {
      return children.props.src;
    }
    return null;
  };

  const imageSrc = getImageSrc();

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden cursor-crosshair", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {actualHovering && imageSrc && (
        <>
          {/* Lens circle overlay */}
          <div
            className="absolute pointer-events-none z-20 border-2 border-white shadow-lg rounded-full"
            style={{
              width: lensSize,
              height: lensSize,
              left: position.x - lensSize / 2,
              top: position.y - lensSize / 2,
              background: `radial-gradient(circle, transparent 45%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.9) 55%, transparent 60%)`,
            }}
          />
          
          {/* Zoomed image */}
          <div
            className="absolute pointer-events-none z-30 rounded-full overflow-hidden border-2 border-white shadow-xl"
            style={{
              width: lensSize,
              height: lensSize,
              left: position.x - lensSize / 2,
              top: position.y - lensSize / 2,
            }}
          >
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url(${imageSrc})`,
                backgroundSize: `${containerRef.current?.offsetWidth * zoomFactor}px ${containerRef.current?.offsetHeight * zoomFactor}px`,
                backgroundPosition: `-${(position.x * zoomFactor) - (lensSize / 2)}px -${(position.y * zoomFactor) - (lensSize / 2)}px`,
                backgroundRepeat: 'no-repeat',
                imageRendering: 'high-quality',
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};