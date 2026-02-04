export interface Track {
  id: string;
  title: string;
  artist: string;
  category: 'pop' | 'rock' | 'rap' | 'jazz' | 'other';
  duration: number;
  fileData: string | number[] | any;  addedDate?: string | Date;
  coverImage?: string;
  description?: string;
}
