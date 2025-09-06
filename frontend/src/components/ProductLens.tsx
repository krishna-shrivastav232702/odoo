import { useState } from "react";
import { Lens } from "@/components/ui/lens";
import { motion } from "framer-motion";

interface ProductLensProps {
  imageSrc: string;
  imageAlt: string;
  className?: string;
}

export function ProductLens({ imageSrc, imageAlt, className }: ProductLensProps) {
  const [hovering, setHovering] = useState(false);

  return (
    <div className={`aspect-square overflow-hidden rounded-lg shadow-medium ${className}`}>
      <Lens hovering={hovering} setHovering={setHovering} lensSize={150}>
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-full object-cover rounded-lg"
        />
      </Lens>
    </div>
  );
}