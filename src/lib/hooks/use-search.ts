import { useState, useCallback } from 'react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/firebase/config';
import type { StreamData } from '@/modules/stream/types/stream.types';
import { LIVESTREAM_CATEGORIES, type CategoryData } from '@/lib/constants/livestream-categories';

export interface UserSearchResult {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  bio?: string;
  followerCount?: number;
}

export interface StreamSearchResult extends StreamData {
  // Extends StreamData with any additional fields needed
}

export interface CategorySearchResult extends CategoryData {
  type: 'category' | 'subcategory';
  parentCategory?: string;
}

export interface SearchResults {
  users: UserSearchResult[];
  streams: StreamSearchResult[];
  categories: CategorySearchResult[];
}

export const useSearch = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResults>({
    users: [],
    streams: [],
    categories: [],
  });

  // Search users by display name or email
  const searchUsers = useCallback(async (searchTerm: string): Promise<UserSearchResult[]> => {
    if (!searchTerm.trim()) return [];

    try {
      const usersRef = collection(db, 'users');
      const lowerSearchTerm = searchTerm.toLowerCase();

      // Search by display name (case-insensitive)
      const displayNameQuery = query(
        usersRef,
        where('displayName', '>=', searchTerm),
        where('displayName', '<=', searchTerm + '\uf8ff'),
        limit(10)
      );

      // Search by email
      const emailQuery = query(
        usersRef,
        where('email', '>=', lowerSearchTerm),
        where('email', '<=', lowerSearchTerm + '\uf8ff'),
        limit(10)
      );

      const [displayNameSnapshot, emailSnapshot] = await Promise.all([
        getDocs(displayNameQuery),
        getDocs(emailQuery),
      ]);

      const usersMap = new Map<string, UserSearchResult>();

      displayNameSnapshot.forEach((doc) => {
        const data = doc.data();
        usersMap.set(doc.id, {
          id: doc.id,
          displayName: data.displayName || '',
          email: data.email || '',
          photoURL: data.photoURL,
          bio: data.bio,
          followerCount: data.followerCount || 0,
        });
      });

      emailSnapshot.forEach((doc) => {
        if (!usersMap.has(doc.id)) {
          const data = doc.data();
          usersMap.set(doc.id, {
            id: doc.id,
            displayName: data.displayName || '',
            email: data.email || '',
            photoURL: data.photoURL,
            bio: data.bio,
            followerCount: data.followerCount || 0,
          });
        }
      });

      return Array.from(usersMap.values());
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }, []);

  // Search streams by name or category
  const searchStreams = useCallback(async (searchTerm: string): Promise<StreamSearchResult[]> => {
    if (!searchTerm.trim()) return [];

    try {
      const streamsRef = collection(db, 'streams');
      const lowerSearchTerm = searchTerm.toLowerCase();

      // Search by stream name
      const nameQuery = query(
        streamsRef,
        where('streamName', '>=', searchTerm),
        where('streamName', '<=', searchTerm + '\uf8ff'),
        orderBy('streamName'),
        limit(20)
      );

      // Search by category (exact match or contains)
      const categoryQuery = query(
        streamsRef,
        where('category', '>=', lowerSearchTerm),
        where('category', '<=', lowerSearchTerm + '\uf8ff'),
        limit(20)
      );

      const [nameSnapshot, categorySnapshot] = await Promise.all([
        getDocs(nameQuery),
        getDocs(categoryQuery),
      ]);

      const streamsMap = new Map<string, StreamSearchResult>();

      nameSnapshot.forEach((doc) => {
        streamsMap.set(doc.id, {
          id: doc.id,
          ...doc.data(),
        } as StreamSearchResult);
      });

      categorySnapshot.forEach((doc) => {
        if (!streamsMap.has(doc.id)) {
          streamsMap.set(doc.id, {
            id: doc.id,
            ...doc.data(),
          } as StreamSearchResult);
        }
      });

      // Sort by isLive first, then by viewerCount
      const streamsArray = Array.from(streamsMap.values());
      return streamsArray.sort((a, b) => {
        if (a.isLive && !b.isLive) return -1;
        if (!a.isLive && b.isLive) return 1;
        return (b.viewerCount || 0) - (a.viewerCount || 0);
      });
    } catch (error) {
      console.error('Error searching streams:', error);
      return [];
    }
  }, []);

  // Search categories and subcategories
  const searchCategories = useCallback((searchTerm: string): CategorySearchResult[] => {
    if (!searchTerm.trim()) return [];

    const lowerSearchTerm = searchTerm.toLowerCase();
    const results: CategorySearchResult[] = [];

    LIVESTREAM_CATEGORIES.forEach((category) => {
      // Check if category name or description matches
      if (
        category.name.toLowerCase().includes(lowerSearchTerm) ||
        category.description.toLowerCase().includes(lowerSearchTerm)
      ) {
        results.push({
          ...category,
          type: 'category',
        });
      }

      // Check subcategories
      if (category.subcategories) {
        category.subcategories.forEach((subcategory) => {
          if (
            subcategory.name.toLowerCase().includes(lowerSearchTerm) ||
            subcategory.description.toLowerCase().includes(lowerSearchTerm)
          ) {
            results.push({
              ...subcategory,
              type: 'subcategory',
              parentCategory: category.name,
            });
          }
        });
      }
    });

    return results;
  }, []);

  // Combined search function
  const search = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults({ users: [], streams: [], categories: [] });
      return;
    }

    setLoading(true);
    try {
      const [users, streams, categories] = await Promise.all([
        searchUsers(searchTerm),
        searchStreams(searchTerm),
        Promise.resolve(searchCategories(searchTerm)),
      ]);

      setResults({ users, streams, categories });
    } catch (error) {
      console.error('Error performing search:', error);
      setResults({ users: [], streams: [], categories: [] });
    } finally {
      setLoading(false);
    }
  }, [searchUsers, searchStreams, searchCategories]);

  // Clear search results
  const clearResults = useCallback(() => {
    setResults({ users: [], streams: [], categories: [] });
  }, []);

  return {
    search,
    searchUsers,
    searchStreams,
    searchCategories,
    loading,
    results,
    clearResults,
  };
};
