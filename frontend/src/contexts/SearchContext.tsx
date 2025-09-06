import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Category, ProductFilters, PaginatedResponse } from '@/types';
import { productsAPI, categoriesAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';

interface SearchContextType {
  // Search and filtering
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  minPrice: number | undefined;
  setMinPrice: (price: number | undefined) => void;
  maxPrice: number | undefined;
  setMaxPrice: (price: number | undefined) => void;
  condition: string | undefined;
  setCondition: (condition: string | undefined) => void;
  
  // Sorting and pagination
  sortBy: 'newest' | 'oldest' | 'price-low' | 'price-high' | 'title' | 'relevance';
  setSortBy: (sort: 'newest' | 'oldest' | 'price-low' | 'price-high' | 'title' | 'relevance') => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (limit: number) => void;
  
  // Data and state
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  
  // Pagination info
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  
  // Advanced filtering
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  availableConditions: string[];
  
  // Actions
  refreshProducts: () => Promise<void>;
  refreshCategories: () => Promise<void>;
  clearFilters: () => void;
  resetSearch: () => void;
  loadNextPage: () => Promise<void>;
  loadPrevPage: () => Promise<void>;
  
  // Real-time features
  lastUpdated: Date | null;
  autoRefresh: boolean;
  setAutoRefresh: (enabled: boolean) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Default values
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const DEFAULT_PRICE_RANGE: [number, number] = [0, 10000];
const AVAILABLE_CONDITIONS = ['new', 'like_new', 'good', 'fair', 'poor'];

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth context for user-specific features
  const { isAuthenticated } = useAuth();
  
  // Search and filtering state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [condition, setCondition] = useState<string | undefined>(undefined);
  const [priceRange, setPriceRange] = useState<[number, number]>(DEFAULT_PRICE_RANGE);
  
  // Sorting and pagination state
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'price-low' | 'price-high' | 'title' | 'relevance'>('newest');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_LIMIT);
  
  // Data state
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination info
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  
  // Real-time features
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  
  const { toast } = useToast();

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1); // Reset to first page on search
      fetchProducts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory, minPrice, maxPrice, condition, sortBy, sortOrder]);

  // Pagination effect
  useEffect(() => {
    fetchProducts();
  }, [currentPage, itemsPerPage]);

  // Load categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchProducts(true); // Silent refresh
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, searchQuery, selectedCategory, minPrice, maxPrice, condition, sortBy, sortOrder, currentPage, itemsPerPage]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await categoriesAPI.getCategories();
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
    }
  }, []);

  const fetchProducts = useCallback(async (silent = false) => {
    try {
      if (!silent) {
        setIsLoading(true);
        setError(null);
      }
      
      // Build filters based on current state
      const filters: ProductFilters = {
        q: searchQuery.trim() || undefined, // Fixed: backend expects 'q' not 'search'
        category: selectedCategory || undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        condition: condition || undefined,
        page: currentPage,
        limit: itemsPerPage,
      };

      // Add sorting parameters that backend supports
      const backendSortBy = sortBy === 'newest' || sortBy === 'oldest' ? 'date' : 
                           sortBy === 'price-low' || sortBy === 'price-high' ? 'price' :
                           sortBy === 'relevance' && searchQuery ? 'relevance' : 'date';
      
      const backendSortOrder = sortBy === 'oldest' || sortBy === 'price-low' ? 'asc' : 'desc';

      const params = {
        ...filters,
        sortBy: backendSortBy,
        sortOrder: backendSortOrder
      };

      const response = await productsAPI.getProducts(params);
      
      // Handle both paginated and simple array responses
      let fetchedProducts: Product[] = [];
      let pagination = null;

      if (response.data && response.data.products && response.data.pagination) {
        // Paginated response
        fetchedProducts = response.data.products;
        pagination = response.data.pagination;
      } else if (response.data && Array.isArray(response.data.data)) {
        // Simple array in data property
        fetchedProducts = response.data.data;
      } else if (Array.isArray(response.data)) {
        // Direct array response
        fetchedProducts = response.data;
      } else {
        console.warn('Unexpected response format:', response.data);
        fetchedProducts = [];
      }

      // Ensure fetchedProducts is always an array
      if (!Array.isArray(fetchedProducts)) {
        console.warn('fetchedProducts is not an array:', fetchedProducts);
        fetchedProducts = [];
      }

      // Client-side sorting for cases where backend doesn't handle all sort types
      if (!pagination && fetchedProducts.length > 0) {
        fetchedProducts.sort((a: Product, b: Product) => {
          switch (sortBy) {
            case 'newest':
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case 'oldest':
              return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case 'price-low':
              return a.price - b.price;
            case 'price-high':
              return b.price - a.price;
            case 'title':
              return a.title.localeCompare(b.title);
            case 'relevance':
              // For relevance, trust backend ordering or fall back to newest
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            default:
              return 0;
          }
        });
      }

      setProducts(fetchedProducts);
      setLastUpdated(new Date());

      // Update pagination info
      if (pagination) {
        setTotalItems(pagination.total);
        setTotalPages(pagination.totalPages);
        setHasNextPage(pagination.hasNext || false);
        setHasPrevPage(pagination.hasPrev || false);
      } else {
        // Estimate pagination for non-paginated responses
        const estimatedTotal = fetchedProducts.length;
        setTotalItems(estimatedTotal);
        setTotalPages(Math.ceil(estimatedTotal / itemsPerPage));
        setHasNextPage(false);
        setHasPrevPage(false);
      }

    } catch (error: any) {
      console.error('Error fetching products:', error);
      let errorMessage = 'Failed to load products';
      
      if (error.response?.status === 500) {
        errorMessage = 'Server error occurred. Please try again later.';
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      setProducts([]);
      
      if (!silent) {
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  }, [searchQuery, selectedCategory, minPrice, maxPrice, condition, sortBy, sortOrder, currentPage, itemsPerPage, toast]);

  // Action handlers
  const refreshProducts = useCallback(async () => {
    await fetchProducts();
  }, [fetchProducts]);

  const refreshCategories = useCallback(async () => {
    await fetchCategories();
  }, [fetchCategories]);

  const clearFilters = useCallback(() => {
    setSelectedCategory(null);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setCondition(undefined);
    setPriceRange(DEFAULT_PRICE_RANGE);
    setCurrentPage(DEFAULT_PAGE);
  }, []);

  const resetSearch = useCallback(() => {
    setSearchQuery('');
    clearFilters();
    setSortBy('newest');
    setSortOrder('desc');
  }, [clearFilters]);

  const loadNextPage = useCallback(async () => {
    if (hasNextPage && currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasNextPage, currentPage, totalPages]);

  const loadPrevPage = useCallback(async () => {
    if (hasPrevPage && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [hasPrevPage, currentPage]);

  // Update price range when min/max prices change
  useEffect(() => {
    if (minPrice !== undefined || maxPrice !== undefined) {
      setPriceRange([minPrice || 0, maxPrice || 10000]);
    }
  }, [minPrice, maxPrice]);

  const contextValue: SearchContextType = {
    // Search and filtering
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    condition,
    setCondition,
    
    // Sorting and pagination
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    
    // Data and state
    products,
    categories,
    isLoading,
    error,
    
    // Pagination info
    totalItems,
    totalPages,
    hasNextPage,
    hasPrevPage,
    
    // Advanced filtering
    priceRange,
    setPriceRange,
    availableConditions: AVAILABLE_CONDITIONS,
    
    // Actions
    refreshProducts,
    refreshCategories,
    clearFilters,
    resetSearch,
    loadNextPage,
    loadPrevPage,
    
    // Real-time features
    lastUpdated,
    autoRefresh,
    setAutoRefresh,
  };

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};