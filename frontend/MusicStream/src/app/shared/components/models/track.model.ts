export interface Track {
  id: string;
  title: string;
  artist: string;
  description?: string;
  addedDate: Date;
  duration: number;
  category: 'pop' | 'rock' | 'rap' | 'jazz' | 'other';
  fileData: File | Blob | any;
  coverImage?: string;
}
