import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Track} from '../../shared/components/models/track.model';


@Injectable({ providedIn: 'root' })
export class TrackService {
  private apiUrl = 'http://localhost:8080/api/tracks';

  constructor(private http: HttpClient) {}


  getTracks(): Observable<Track[]> {
    return this.http.get<Track[]>(this.apiUrl);
  }

  addTrack(track: Track): Observable<Track> {
    return this.http.post<Track>(this.apiUrl, track);
  }
  getAllTracks(): Observable<Track[]> {
    return this.http.get<Track[]>(this.apiUrl);
  }
  getTrackById(id: string): Observable<Track> {
    return this.http.get<Track>(`${this.apiUrl}/${id}`);
  }

  deleteTrack(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  updateTrack(id: string, updates: Partial<Track>): Observable<Track> {
    return this.http.put<Track>(`${this.apiUrl}/${id}`, updates);
  }
}
