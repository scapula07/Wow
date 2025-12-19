import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { SearchIcon, X } from 'lucide-react';
import { useSearch } from '@/lib/hooks/use-search';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Video, Folder } from 'lucide-react';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const { search, loading, results } = useSearch();

  useEffect(() => {
    if (initialQuery) {
      search(initialQuery);
    }
  }, [initialQuery, search]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.trim()) {
      setSearchParams({ q: value });
      search(value);
    } else {
      setSearchParams({});
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setSearchParams({});
  };

  const handleUserClick = (userId: string) => {
    navigate(`/user/${userId}/profile`);
  };

  const handleStreamClick = (streamId: string) => {
    navigate(`/streams/${streamId}`);
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/browse?category=${categoryId}`);
  };

  const hasResults = results.users.length > 0 || results.streams.length > 0 || results.categories.length > 0;

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      <h1 className="text-white text-2xl font-bold mb-6">Search</h1>

      {/* Search Input */}
      <div className="relative max-w-2xl mb-8">
        <Input
          placeholder="Search for streamers, streams, or categories"
          className="pl-12 pr-12 h-14 text-lg border-gray-700 !bg-[#1a1a1a] !text-white"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          autoFocus
        />
        <SearchIcon className="text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6" />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-400 text-lg">Searching...</div>
        </div>
      )}

      {/* No Results */}
      {!loading && searchTerm && !hasResults && (
        <div className="flex flex-col items-center justify-center py-12">
          <SearchIcon className="w-16 h-16 text-gray-600 mb-4" />
          <div className="text-gray-400 text-lg">No results found for "{searchTerm}"</div>
          <div className="text-gray-500 text-sm mt-2">Try different keywords</div>
        </div>
      )}

      {/* Results */}
      {!loading && hasResults && (
        <div className="space-y-8">
          {/* Users Section */}
          {results.users.length > 0 && (
            <section>
              <div className="flex items-center gap-2 text-gray-400 text-sm font-semibold mb-4">
                <Users className="w-5 h-5" />
                <span>STREAMERS ({results.users.length})</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.users.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleUserClick(user.id)}
                    className="flex items-center gap-4 p-4 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg cursor-pointer transition-colors"
                  >
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={user.photoURL} alt={user.displayName} />
                      <AvatarFallback className="bg-primary text-white">
                        {user.displayName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium truncate">
                        {user.displayName || user.email}
                      </div>
                      {user.bio && (
                        <div className="text-gray-400 text-sm truncate">
                          {user.bio}
                        </div>
                      )}
                      {user.followerCount !== undefined && user.followerCount > 0 && (
                        <div className="text-gray-500 text-xs mt-1">
                          {user.followerCount} {user.followerCount === 1 ? 'follower' : 'followers'}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Streams Section */}
          {results.streams.length > 0 && (
            <section>
              <div className="flex items-center gap-2 text-gray-400 text-sm font-semibold mb-4">
                <Video className="w-5 h-5" />
                <span>STREAMS ({results.streams.length})</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {results.streams.map((stream) => (
                  <div
                    key={stream.id}
                    onClick={() => handleStreamClick(stream.id)}
                    className="bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg cursor-pointer transition-colors overflow-hidden"
                  >
                    <div className="w-full aspect-video bg-gray-800 relative">
                      {stream.streamThumbnail ? (
                        <img 
                          src={stream.streamThumbnail} 
                          alt={stream.streamName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Video className="w-12 h-12 text-gray-600" />
                        </div>
                      )}
                      {stream.isLive && (
                        <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                          🔴 LIVE
                        </span>
                      )}
                      {stream.viewerCount > 0 && (
                        <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {stream.viewerCount} viewers
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <div className="text-white font-medium truncate mb-1">
                        {stream.streamName}
                      </div>
                      <div className="text-gray-400 text-sm truncate">
                        {stream.category}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Categories Section */}
          {results.categories.length > 0 && (
            <section>
              <div className="flex items-center gap-2 text-gray-400 text-sm font-semibold mb-4">
                <Folder className="w-5 h-5" />
                <span>CATEGORIES ({results.categories.length})</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.categories.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className="flex items-start gap-4 p-4 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="w-20 h-14 rounded overflow-hidden bg-gray-800 flex-shrink-0">
                      {category.image ? (
                        <img 
                          src={category.image} 
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Folder className="w-8 h-8 text-gray-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium truncate mb-1">
                        {category.name}
                      </div>
                      {category.type === 'subcategory' && category.parentCategory && (
                        <div className="text-gray-500 text-xs mb-1">
                          in {category.parentCategory}
                        </div>
                      )}
                      <div className="text-gray-400 text-sm line-clamp-2">
                        {category.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Empty State */}
      {!loading && !searchTerm && (
        <div className="flex flex-col items-center justify-center py-12">
          <SearchIcon className="w-16 h-16 text-gray-600 mb-4" />
          <div className="text-gray-400 text-lg">Start searching</div>
          <div className="text-gray-500 text-sm mt-2">Find streamers, streams, and categories</div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
