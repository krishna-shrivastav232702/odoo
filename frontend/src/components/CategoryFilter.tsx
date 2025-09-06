import { Button } from '@/components/ui/button';
import { CATEGORIES } from '@/types';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2 p-4 bg-muted/30 rounded-lg">
      <Button
        onClick={() => onCategoryChange(null)}
        variant={selectedCategory === null ? "default" : "outline"}
        size="sm"
        className={selectedCategory === null ? "gradient-primary text-primary-foreground border-0" : ""}
      >
        All Categories
      </Button>
      
      {CATEGORIES.map((category) => (
        <Button
          key={category}
          onClick={() => onCategoryChange(category)}
          variant={selectedCategory === category ? "default" : "outline"}
          size="sm"
          className={selectedCategory === category ? "gradient-primary text-primary-foreground border-0" : ""}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;