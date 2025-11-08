import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/config";
import type { CategoryData } from "@/lib/constants/livestream-categories";

interface StreamCategoryCount {
  [categoryId: string]: number;
}

/**
 * Client-side aggregation approach
 * Fetches all streams and counts by category
 * Best for < 1000 streams
 */
export async function getStreamCountsByCategory(): Promise<StreamCategoryCount> {
  try {
    const q = query(collection(db, "streams"));
    const snapshot = await getDocs(q);
    
    const counts: StreamCategoryCount = {};
    
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      const category = data.category;
      
      if (category) {
        counts[category] = (counts[category] || 0) + 1;
      }
    });
    
    return counts;
  } catch (error) {
    console.error("Error counting streams by category:", error);
    return {};
  }
}

/**
 * Get stream count for a specific category
 */
export async function getStreamCountForCategory(categoryId: string): Promise<number> {
  try {
    const q = query(
      collection(db, "streams"),
      where("category", "==", categoryId)
    );
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error(`Error counting streams for category ${categoryId}:`, error);
    return 0;
  }
}

/**
 * Enrich categories with actual stream counts from database
 */
export async function enrichCategoriesWithCounts(
  categories: CategoryData[]
): Promise<CategoryData[]> {
  const counts = await getStreamCountsByCategory();
  
  return categories.map(category => ({
    ...category,
    streamCount: counts[category.id] || 0
  }));
}

/**
 * In-memory cache for category counts
 * Cache for 60 seconds to reduce Firestore reads
 */
class CategoryCountCache {
  private cache: StreamCategoryCount | null = null;
  private lastFetch: number = 0;
  private readonly TTL = 60000; // 60 seconds

  async getCounts(): Promise<StreamCategoryCount> {
    const now = Date.now();
    
    if (this.cache && (now - this.lastFetch) < this.TTL) {
      console.log("📦 Using cached category counts");
      return this.cache;
    }
    
    console.log("🔄 Fetching fresh category counts");
    this.cache = await getStreamCountsByCategory();
    this.lastFetch = now;
    
    return this.cache;
  }

  clear() {
    this.cache = null;
    this.lastFetch = 0;
  }
}

export const categoryCountCache = new CategoryCountCache();
