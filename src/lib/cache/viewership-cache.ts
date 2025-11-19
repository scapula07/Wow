interface CacheEntry {
  data: number;
  timestamp: number;
}

class ViewershipCache {
  private cache: Map<string, CacheEntry> = new Map();
  private TTL = 20000; // 20 seconds cache for viewership data

  set(playbackId: string, viewCount: number) {
    this.cache.set(playbackId, {
      data: viewCount,
      timestamp: Date.now()
    });
  }

  get(playbackId: string): number | null {
    const entry = this.cache.get(playbackId);
    
    if (!entry) return null;
    
    // Check if cache is still valid
    if (Date.now() - entry.timestamp > this.TTL) {
      this.cache.delete(playbackId);
      return null;
    }
    
    return entry.data;
  }

  clear() {
    this.cache.clear();
  }

  delete(playbackId: string) {
    this.cache.delete(playbackId);
  }

  // Clean up expired entries periodically
  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.TTL) {
        this.cache.delete(key);
      }
    }
  }

  // Get cache statistics
  getStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.entries()).map(([key, value]) => ({
        playbackId: key,
        viewCount: value.data,
        age: Date.now() - value.timestamp
      }))
    };
  }
}

export const viewershipCache = new ViewershipCache();

// Run cleanup every 2 minutes to remove expired entries
setInterval(() => {
  viewershipCache.cleanup();
  console.log('🧹 Viewership cache cleanup completed');
}, 30000);
