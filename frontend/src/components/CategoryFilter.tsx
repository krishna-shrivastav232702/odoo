import { useState, useEffect } from 'react';
import { Filter, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useSearch } from '@/contexts/SearchContext';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  const { 
    categories, 
    minPrice, 
    setMinPrice, 
    maxPrice, 
    setMaxPrice,
    condition,
    setCondition 
  } = useSearch();
  
  const [priceRange, setPriceRange] = useState([minPrice || 0, maxPrice || 1000]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  useEffect(() => {
    setPriceRange([minPrice || 0, maxPrice || 1000]);
  }, [minPrice, maxPrice]);

  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange(values);
    setMinPrice(values[0] > 0 ? values[0] : undefined);
    setMaxPrice(values[1] < 1000 ? values[1] : undefined);
  };

  const clearFilters = () => {
    onCategoryChange(null);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setCondition(undefined);
    setPriceRange([0, 1000]);
  };

  const activeFiltersCount = [
    selectedCategory,
    minPrice,
    maxPrice,
    condition
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedCategory === null ? "default" : "secondary"}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onCategoryChange(null)}
            >
              All Categories
            </Badge>
            {categories.map((category) => (
              <Badge
                key={category.id}
                variant={selectedCategory === category.name ? "default" : "secondary"}
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => onCategoryChange(
                  selectedCategory === category.name ? null : category.name
                )}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      <Card>
        <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </div>
                <Button variant="ghost" size="sm">
                  {isFiltersOpen ? '−' : '+'}
                </Button>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent className="space-y-6">
              {/* Price Range */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Price Range</Label>
                <Slider
                  value={priceRange}
                  onValueChange={handlePriceRangeChange}
                  max={1000}
                  min={0}
                  step={10}
                  className="w-full"
                />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>${priceRange[0]}</span>
                  <span>−</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>

              {/* Condition */}
              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <Select value={condition || "any"} onValueChange={(value) => setCondition(value === "any" ? undefined : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any condition</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="like_new">Like New</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
};

export default CategoryFilter;