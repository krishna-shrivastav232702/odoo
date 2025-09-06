"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LensProps {
  children: React.ReactNode;
  lensSize?: number;
  hovering?: boolean;
  setHovering?: (hovering: boolean) => void;
}

export const Lens: React.FC<LensProps> = ({
  children,
  lensSize = 200,
  hovering,
  setHovering,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [localIsHovering, setLocalIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 100, y: 100 });

  const isHovering = hovering !== undefined ? hovering : localIsHovering;
  const setIsHovering = setHovering || setLocalIsHovering;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  // Extract image source from children
  const getImageSrc = () => {
    if (React.isValidElement(children)) {
      return (children.props as any).src;
    }
    return '';
  };

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-2xl cursor-none"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Main image with blur effect when hovering */}
      <motion.div
        animate={{
          filter: isHovering ? "blur(4px)" : "blur(0px)",
        }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>

      {/* Lens effect - shows clear image in circular area */}
      {isHovering && (
        <motion.div
          className="absolute pointer-events-none z-10"
          style={{
            left: mousePosition.x - lensSize / 2,
            top: mousePosition.y - lensSize / 2,
            width: lensSize,
            height: lensSize,
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="w-full h-full rounded-full overflow-hidden border-2 border-white shadow-xl"
            style={{
              backgroundImage: `url(${getImageSrc()})`,
              backgroundSize: `${containerRef.current?.offsetWidth}px ${containerRef.current?.offsetHeight}px`,
              backgroundPosition: `${-(mousePosition.x - lensSize / 2)}px ${-(mousePosition.y - lensSize / 2)}px`,
              backgroundRepeat: 'no-repeat',
            }}
          />
        </motion.div>
      )}
    </div>
  );
};