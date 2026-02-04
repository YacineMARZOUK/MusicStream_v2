import { Injectable, signal, inject } from '@angular/core';
import { Track } from '../../shared/components/models/track.model';
import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';
import { selectAllTracks } from './track.selectors';
import {TrackService} from './TrackService';

@Injectable({ providedIn: 'root' })
export class AudioPlayerService {
  private store = inject(Store);
  private trackApi = inject(TrackService); // ✅ Injectez l'API service

  private audio = new Audio();
  private currentBlobUrl: string | null = null;

  currentTrack = signal<Track | null>(null);
  isPlaying = signal<boolean>(false);
  currentTime = signal<number>(0);
  duration = signal<number>(0);
  volume = signal<number>(0.5);

  constructor() {
    this.audio.ontimeupdate = () => this.currentTime.set(this.audio.currentTime);
    this.audio.onloadedmetadata = () => this.duration.set(this.audio.duration);
    this.audio.onplay = () => this.isPlaying.set(true);
    this.audio.onpause = () => this.isPlaying.set(false);
    this.audio.onended = () => this.next();
    this.audio.volume = 0.5;
  }

  // ✅ Modifiez cette méthode pour charger le track complet
  playTrack(track: Track): void {
    // On évite de recharger si c'est déjà la même chanson qui joue
    if (this.currentTrack()?.id !== track.id) {
      this.currentTrack.set(track);

      let byteArray: Uint8Array;

      // Décodage Base64 (cas Spring Boot par défaut) ou tableau direct
      if (typeof track.fileData === 'string') {
        const binaryString = window.atob(track.fileData);
        byteArray = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          byteArray[i] = binaryString.charCodeAt(i);
        }
      } else {
        // Cast en unknown puis number[] pour éviter les erreurs de type strictes
        byteArray = new Uint8Array(track.fileData as unknown as number[]);
      }

      // CORRECTION DU TS2322 ICI :
      // On utilise "as any" car TypeScript est trop strict sur le type BlobPart
      const blob = new Blob([byteArray as any], { type: 'audio/mpeg' });

      // Gestion propre de l'URL pour éviter les fuites mémoire
      if (this.currentBlobUrl) {
        URL.revokeObjectURL(this.currentBlobUrl);
      }

      this.currentBlobUrl = URL.createObjectURL(blob);
      this.audio.src = this.currentBlobUrl;
      this.audio.load();
    }

    this.audio.play().catch(err => console.error('Erreur de lecture:', err));
  }

  togglePlay() {
    if (this.isPlaying()) {
      this.audio.pause();
    } else {
      this.audio.play().catch(err => console.error('Erreur play:', err));
    }
  }

  async next() {
    const tracks = await firstValueFrom(this.store.select(selectAllTracks));
    const current = this.currentTrack();

    if (current && tracks.length > 0) {
      const currentIndex = tracks.findIndex((t: Track) => t.id === current.id);
      const nextIndex = (currentIndex + 1) % tracks.length;
      await this.playTrack(tracks[nextIndex]); // ✅ Ajoutez await
    }
  }

  async previous() {
    const tracks = await firstValueFrom(this.store.select(selectAllTracks));
    const current = this.currentTrack();

    if (current && tracks.length > 0) {
      const currentIndex = tracks.findIndex((t: Track) => t.id === current.id);
      const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
      await this.playTrack(tracks[prevIndex]); // ✅ Ajoutez await
    }
  }

  seek(time: number) {
    this.audio.currentTime = time;
  }

  setVolume(val: number) {
    this.audio.volume = val;
    this.volume.set(val);
  }
}
