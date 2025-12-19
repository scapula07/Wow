import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Users, Video, Folder } from 'lucide-react';
import type { SearchResults } from '@/lib/hooks/use-search';

interface SearchResultsProps {
  results: SearchResults;
  loading: boolean;
  searchTerm: string;
  onClose: () => void;
}

export const SearchResultsPanel = ({ results, loading, searchTerm, onClose }: SearchResultsProps) => {
  const navigate = useNavigate();

  const handleUserClick = (userId: string) => {
    navigate(`/user/${userId}/profile`);
    onClose();
  };

  const handleStreamClick = (streamId: string) => {
    navigate(`/streams/${streamId}`);
    onClose();
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/browse?category=${categoryId}`);
    onClose();
  };

  if (!searchTerm) {
    return null;
  }

  if (loading) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] rounded-lg shadow-xl border border-gray-800 p-6 z-50">
        <div className="flex items-center justify-center">
          <div className="text-gray-400">Searching...</div>
        </div>
      </div>
    );
  }

  const hasResults = results.users.length > 0 || results.streams.length > 0 || results.categories.length > 0;

  if (!hasResults) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] rounded-lg shadow-xl border border-gray-800 p-6 z-50">
        <div className="flex items-center justify-center">
          <div className="text-gray-400">No results found for "{searchTerm}"</div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] rounded-lg shadow-xl border border-gray-800 max-h-[500px] overflow-y-auto z-50">
      {/* Users Section */}
      {results.users.length > 0 && (
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-2 text-gray-400 text-sm font-semibold mb-3">
            <Users className="w-4 h-4" />
            <span>STREAMERS ({results.users.length})</span>
          </div>
          <div className="space-y-2">
            {results.users.map((user) => (
              <div
                key={user.id}
                onClick={() => handleUserClick(user.id)}
                className="flex items-center gap-3 p-2 hover:bg-[#2a2a2a] rounded-lg cursor-pointer transition-colors"
              >
                <Avatar className="w-10 h-10">
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
                    <div className="text-gray-400 text-xs truncate">
                      {user.bio}
                    </div>
                  )}
                  {user.followerCount !== undefined && user.followerCount > 0 && (
                    <div className="text-gray-500 text-xs">
                      {user.followerCount} {user.followerCount === 1 ? 'follower' : 'followers'}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Streams Section */}
      {results.streams.length > 0 && (
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-2 text-gray-400 text-sm font-semibold mb-3">
            <Video className="w-4 h-4" />
            <span>STREAMS ({results.streams.length})</span>
          </div>
          <div className="space-y-2">
            {results.streams.map((stream) => (
              <div
                key={stream.id}
                onClick={() => handleStreamClick(stream.id)}
                className="flex items-start gap-3 p-2 hover:bg-[#2a2a2a] rounded-lg cursor-pointer transition-colors"
              >
                <div className="w-20 h-12 rounded overflow-hidden bg-gray-800 flex-shrink-0 relative">
                  {stream.streamThumbnail ? (
                    <img 
                      src={stream.streamThumbnail} 
                      alt={stream.streamName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="w-6 h-6 text-gray-600" />
                    </div>
                  )}
                  {stream.isLive && (
                    <span className="absolute top-1 left-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      LIVE
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium truncate">
                    {stream.streamName}
                  </div>
                  <div className="text-gray-400 text-xs truncate">
                    {stream.category}
                  </div>
                  {stream.viewerCount > 0 && (
                    <div className="text-gray-500 text-xs">
                      {stream.viewerCount} {stream.viewerCount === 1 ? 'viewer' : 'viewers'}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categories Section */}
      {results.categories.length > 0 && (
        <div className="p-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm font-semibold mb-3">
            <Folder className="w-4 h-4" />
            <span>CATEGORIES ({results.categories.length})</span>
          </div>
          <div className="space-y-2">
            {results.categories.map((category) => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="flex items-start gap-3 p-2 hover:bg-[#2a2a2a] rounded-lg cursor-pointer transition-colors"
              >
                <div className="w-16 h-10 rounded overflow-hidden bg-gray-800 flex-shrink-0">
                  {category.image ? (
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Folder className="w-5 h-5 text-gray-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium truncate">
                    {category.name}
                  </div>
                  {category.type === 'subcategory' && category.parentCategory && (
                    <div className="text-gray-500 text-xs">
                      in {category.parentCategory}
                    </div>
                  )}
                  <div className="text-gray-400 text-xs truncate">
                    {category.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
