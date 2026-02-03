import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TrackActions } from '../../core/store/track.actions';
import { Track } from '../../shared/components/models/track.model';
import { AudioPlayerService } from '../../core/services/audio-player';
import { DurationPipe } from '../../shared/pipes/duration.pipe';
import { RouterLink } from '@angular/router';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import {selectAllTracks} from '../../core/services/track.selectors';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [ReactiveFormsModule, DurationPipe, RouterLink, AsyncPipe],
  templateUrl: './library.component.html'
})
export class LibraryComponent implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  playerService = inject(AudioPlayerService);

  // Observable pour le HTML
  tracks$ = this.store.select(selectAllTracks);

  private selectedFile: File | null = null;
  private currentFileDuration: number = 0;
  isEditing = false;
  currentTrackId: string | null = null;

  trackForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(50)]],
    artist: ['', Validators.required],
    category: ['rap', Validators.required],
    file: [null, [Validators.required]]
  });

  ngOnInit() {
    this.store.dispatch(TrackActions.loadTracks());
  }

  // --- LOGIQUE DE FICHIER (Inchangée) ---
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const audio = new Audio();
        audio.src = e.target.result;
        audio.onloadedmetadata = () => this.currentFileDuration = Math.round(audio.duration);
      };
      reader.readAsDataURL(file);
      this.trackForm.patchValue({ file: file });
    }
  }

  // --- ACTIONS NGRX ---
  onSubmit() {
    if (this.trackForm.valid) {
      const formValues = this.trackForm.value;

      if (this.isEditing && this.currentTrackId) {
        // UPDATE via NgRx
        const updates: Partial<Track> = {
          title: formValues.title!,
          artist: formValues.artist!,
          category: formValues.category as any,
          duration: this.selectedFile ? this.currentFileDuration : undefined
        };
        this.store.dispatch(TrackActions.updateTrack({ id: this.currentTrackId, updates }));
        this.cancelEdit();
      } else {

        const newTrack: Track = {
          id: crypto.randomUUID(),
          title: formValues.title!,
          artist: formValues.artist!,
          category: formValues.category as any,
          addedDate: new Date(),
          duration: this.currentFileDuration,
          fileData: []
        };
        this.store.dispatch(TrackActions.addTrack({ track: newTrack }));
        this.cancelEdit();
      }
    }
  }

  confirmDelete(track: Track) {
    if (confirm(`Supprimer "${track.title}" ?`)) {
      this.store.dispatch(TrackActions.deleteTrack({ id: track.id }));
    }
  }

  // --- HELPERS FORMULAIRE ---
  editTrack(track: Track) {
    this.isEditing = true;
    this.currentTrackId = track.id;
    this.trackForm.patchValue({ title: track.title, artist: track.artist, category: track.category });
    this.trackForm.get('file')?.clearValidators();
    this.trackForm.get('file')?.updateValueAndValidity();
  }

  cancelEdit() {
    this.isEditing = false;
    this.currentTrackId = null;
    this.trackForm.reset({ category: 'rap' });
    this.trackForm.get('file')?.setValidators([Validators.required]);
    this.trackForm.get('file')?.updateValueAndValidity();
  }

  playTrack(track: Track) { this.playerService.playTrack(track); }
}
