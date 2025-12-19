import { useState, useEffect } from 'react';
import { getUserBlockedStreams } from '@/firebase/block';
import { useAuth } from './use-auth';
import type { StreamData } from '@/modules/stream/types/stream.types';

/**
 * Hook to filter out blocked and censored streams
 */
export const useFilteredStreams = (streams: StreamData[]) => {
  const { user } = useAuth();
  const [blockedStreamIds, setBlockedStreamIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's blocked streams
  useEffect(() => {
    const fetchBlockedStreams = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const blocked = await getUserBlockedStreams(user.id);
        setBlockedStreamIds(blocked);
      } catch (error) {
        console.error('Error fetching blocked streams:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlockedStreams();
  }, [user?.id]);

  // Filter streams
  const filteredStreams = streams.filter((stream) => {
    // Filter out streams blocked by this user
    if (blockedStreamIds.includes(stream.id)) {
      return false;
    }

    // Filter out streams censored by community (isCensored flag)
    if (stream.isCensored === true) {
      return false;
    }

    return true;
  });

  return {
    filteredStreams,
    loading,
    blockedCount: blockedStreamIds.length,
  };
};
