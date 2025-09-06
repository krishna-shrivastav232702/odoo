import { useState } from "react";
import { Lens } from "@/components/ui/lens";

interface ProductImageLensProps {
  imageSrc: string;
  imageAlt: string;
  className?: string;
}

export function ProductImageLens({ imageSrc, imageAlt, className }: ProductImageLensProps) {
  const [hovering, setHovering] = useState(false);

  return (
    <div className={`w-full h-full rounded-lg overflow-hidden shadow-medium ${className}`}>
      <Lens hovering={hovering} setHovering={setHovering} zoomFactor={2.5} lensSize={150}>
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-full object-cover"
        />
      </Lens>
    </div>
  );
}