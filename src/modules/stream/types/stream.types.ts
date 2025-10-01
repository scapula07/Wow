export interface StreamData {
  id: string;
  creatorId: string;
  streamName: string;
  streamThumbnail: string | null;
  category: string;
  playbackId: string;
  streamKey: string;
  livepeerStreamId: string;
  isActive: boolean;
  createdAt: string;
  isLive: boolean;
  viewerCount: number;
}

export interface StreamDetails {
  name: string;
  category: string;
  schedule: string;
  thumbnail: File | null;
}
