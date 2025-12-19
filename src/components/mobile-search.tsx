import { useState, useEffect, useRef } from 'react';
import { Input } from './ui/input';
import { SearchIcon, X } from 'lucide-react';
import { useSearch } from '@/lib/hooks/use-search';
import { SearchResultsPanel } from './search-results';

interface MobileSearchProps {
  onClose: () => void;
}

export const MobileSearch = ({ onClose }: MobileSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { search, loading, results, clearResults } = useSearch();
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim()) {
        search(searchTerm);
        setShowResults(true);
      } else {
        clearResults();
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, search, clearResults]);

  const handleClearSearch = () => {
    setSearchTerm('');
    clearResults();
    setShowResults(false);
  };

  const handleResultClose = () => {
    setShowResults(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-[100] md:hidden">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onClose}
            className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-white text-lg font-semibold">Search</h2>
        </div>

        <div className="relative" ref={searchRef}>
          <Input
            placeholder="Search for streamers, streams, or categories"
            className="pl-10 pr-10 border-gray-700 !bg-[#1a1a1a] !text-white h-12 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
          <SearchIcon className="text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Search Results Panel */}
          {showResults && (
            <div className="mt-4">
              <SearchResultsPanel
                results={results}
                loading={loading}
                searchTerm={searchTerm}
                onClose={handleResultClose}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
