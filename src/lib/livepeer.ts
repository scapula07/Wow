import axios from 'axios';

// Livepeer API configuration
const LIVEPEER_API_URL = 'https://livepeer.studio/api';
const LIVEPEER_API_KEY = import.meta.env.VITE_LIVEPEER_API_KEY;

// Create axios instance with default config
const livepeerApi = axios.create({
  baseURL: LIVEPEER_API_URL,
  headers: {
    'Authorization': `Bearer ${LIVEPEER_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

// Types for Livepeer Stream API
interface StreamProfile {
  name: string;
  fps: number;
  bitrate: number;
  width: number;
  height: number;
}

interface PlaybackPolicy {
  type: 'public' | 'jwt' | 'webhook';
  webhookId?: string;
  webhookContext?: Record<string, any>;
  refreshInterval?: number;
  allowedOrigins?: string[];
}

interface CreateStreamRequest {
  name: string;
  pull?: {
    source: string;
    headers?: Record<string, string>;
    isMobile?: number;
    location?: {
      lat: number;
      lon: number;
    };
  };
  creatorId?: {
    type: 'unverified' | 'verified';
    value: string;
  };
  playbackPolicy?: PlaybackPolicy;
  profiles?: Record<string, StreamProfile>;
  record?: boolean;
  recordingSpec?: {
    profiles: Array<{
      width: number;
      name: string;
      height: number;
      bitrate: number;
      quality: number;
      fps: number;
      fpsDen: number;
      gop: number;
      profile: string;
      encoder: string;
    }>;
  };
  multistream?: {
    targets: Array<{
      id: string;
      profile: string;
    }>;
  };
  userTags?: Record<string, any>;
}

interface LivepeerStream {
  id: string;
  name: string;
  streamKey: string;
  playbackId: string;
  isActive: boolean;
  lastSeen: number;
  sourceSegments: number;
  transcodedSegments: number;
  sourceSegmentsDuration: number;
  transcodedSegmentsDuration: number;
  sourceBytes: number;
  transcodedBytes: number;
  profiles: StreamProfile[];
  record: boolean;
  suspended: boolean;
  parentId: string;
  createdAt: number;
  userId: string;
  renditions: string;
  mp4Url: string;
  recordingStatus: string;
  recordingUrl: string;
  pull: any;
  creatorId: any;
  playbackPolicy: PlaybackPolicy;
  userTags: Record<string, any>;
}

// Default stream profiles for different quality levels
const DEFAULT_PROFILES: Record<string, StreamProfile> = {
  "0": {
    name: "240p0",
    fps: 0,
    bitrate: 250000,
    width: 426,
    height: 240
  },
  "1": {
    name: "360p0",
    fps: 0,
    bitrate: 800000,
    width: 640,
    height: 360
  },
  "2": {
    name: "480p0",
    fps: 0,
    bitrate: 1600000,
    width: 854,
    height: 480
  },
  "3": {
    name: "720p0",
    fps: 0,
    bitrate: 3000000,
    width: 1280,
    height: 720
  }
};

export const livepeerClient = {
  /**
   * Create a new stream
   */
  createStream: async (streamData: CreateStreamRequest): Promise<{ success: boolean; data?: LivepeerStream; error?: string }> => {
    try {
      const response = await livepeerApi.post<LivepeerStream>('/stream', streamData);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Livepeer createStream error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to create stream'
      };
    }
  },

  /**
   * Create a basic stream with minimal configuration
   */
  createBasicStream: async (streamName: string, creatorId?: string): Promise<{ success: boolean; data?: LivepeerStream; error?: string }> => {
    const streamConfig: CreateStreamRequest = {
      name: streamName,
      record: true,
      playbackPolicy: {
        type: 'public'
      }
    };

    // Add creator ID if provided
    if (creatorId) {
      streamConfig.creatorId = {
        type: 'unverified',
        value: creatorId
      };
    }

    return await livepeerClient.createStream(streamConfig);
  },

  /**
   * Get stream by ID
   */
  getStream: async (streamId: string): Promise<{ success: boolean; data?: LivepeerStream; error?: string }> => {
    try {
      const response = await livepeerApi.get<LivepeerStream>(`/stream/${streamId}`);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Livepeer getStream error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to get stream'
      };
    }
  },

  /**
   * Get all streams for the user
   */
  getStreams: async (): Promise<{ success: boolean; data?: LivepeerStream[]; error?: string }> => {
    try {
      const response = await livepeerApi.get<LivepeerStream[]>('/stream');
      
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Livepeer getStreams error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to get streams'
      };
    }
  },

  /**
   * Delete a stream
   */
  deleteStream: async (streamId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await livepeerApi.delete(`/stream/${streamId}`);
      
      return {
        success: true
      };
    } catch (error: any) {
      console.error('Livepeer deleteStream error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to delete stream'
      };
    }
  },

  /**
   * Get all recorded sessions for a stream
   */
  getStreamSessions: async (parentId: string): Promise<{ success: boolean; data?: any[]; error?: string }> => {
    try {
      const response = await livepeerApi.get(`/stream/${parentId}/sessions`);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Livepeer getStreamSessions error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to get stream sessions'
      };
    }
  },

  /**
   * Get total viewership for a playback
   */
  getViewership: async (playbackId: string): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      const response = await livepeerApi.get(`/data/views/query/total/${playbackId}`);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Livepeer getViewership error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to get viewership data'
      };
    }
  }
};

export type { CreateStreamRequest, LivepeerStream, StreamProfile, PlaybackPolicy };