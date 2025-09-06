import { ImageMagnifier } from '@/components/ui/image-magnifier';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({ 
  src, 
  alt, 
  className = '' 
}) => {
  // Create a higher resolution version of the image URL for better zoom quality
  const getHighResImage = (originalSrc: string) => {
    // If it's an Unsplash image, we can request a higher resolution
    if (originalSrc.includes('unsplash.com')) {
      return originalSrc.replace(/w=\d+/, 'w=2000').replace(/h=\d+/, 'h=2000');
    }
    return originalSrc;
  };

  return (
    <div className={`aspect-square overflow-hidden rounded-lg shadow-medium bg-gray-100 ${className}`}>
      <ImageMagnifier
        src={getHighResImage(src)}
        alt={alt}
        magnifierSize={160}
        zoomLevel={2}
        className="w-full h-full"
      />
    </div>
  );
};