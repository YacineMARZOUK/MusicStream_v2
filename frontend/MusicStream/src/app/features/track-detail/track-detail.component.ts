import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AudioPlayerService } from '../../core/services/audio-player';
import { Track } from '../../shared/components/models/track.model';
import { DurationPipe } from '../../shared/pipes/duration.pipe';
import { map } from 'rxjs';
import {selectAllTracks} from '../../core/services/track.selectors';

@Component({
  selector: 'app-track-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DurationPipe],
  templateUrl: './track-detail.html'
})
export class TrackDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private store = inject(Store);
  public playerService = inject(AudioPlayerService);

  track = signal<Track | null>(null);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // On cherche le morceau dans le Store global
      this.store.select(selectAllTracks).pipe(
        map(tracks => tracks.find(t => t.id === id))
      ).subscribe(foundTrack => {
        if (foundTrack) {
          this.track.set(foundTrack);
        }
      });
    }
  }
}
