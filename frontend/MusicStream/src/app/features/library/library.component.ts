import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TrackActions } from '../../core/store/track.actions';
import { Track } from '../../shared/components/models/track.model';
import { AudioPlayerService } from '../../core/services/audio-player';
import { TrackService } from '../../core/services/TrackService';
import { DurationPipe } from '../../shared/pipes/duration.pipe';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import {selectAllTracks} from '../../core/services/track.selectors';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DurationPipe,
    RouterLink,
    AsyncPipe,
  ],
  templateUrl: './library.component.html'
})
export class LibraryComponent implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  // Injection en public pour résoudre les erreurs TS2339 dans le HTML
  public trackService = inject(TrackService);
  public playerService = inject(AudioPlayerService);

  // Observable pour la liste NgRx
  tracks$ = this.store.select(selectAllTracks);

  private selectedFile: File | null = null;
  private currentFileDuration: number = 0;
  isEditing = false;
  currentTrackId: string | null = null;


  searchQuery = signal<string>('');
  selectedCategory = signal<string>('all');

  trackForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(50)]],
    artist: ['', Validators.required],
    category: ['rap', Validators.required],
    file: [null, [Validators.required]]
  });

  ngOnInit() {
    this.store.dispatch(TrackActions.loadTracks());
  }



  updateSearch(query: string) {
    this.searchQuery.set(query);

  }

  updateCategory(category: string) {
    this.selectedCategory.set(category);

  }

  // --- LOGIQUE DE FICHIER ---
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
    } else {
      alert("Fichier trop lourd ou invalide");
    }
  }

  // --- ACTIONS NGRX ---
  onSubmit() {
    if (this.trackForm.valid && this.selectedFile) {
      const reader = new FileReader();

      // 1. Lire le fichier en tant qu'URL de données (Base64)
      reader.readAsDataURL(this.selectedFile);

      reader.onload = () => {
        // 2. Récupérer uniquement la partie Base64 (après la virgule)
        // Exemple : "data:audio/mp3;base64,SUQzBAAAAA..." -> on garde "SUQzBAAAAA..."
        const base64String = (reader.result as string).split(',')[1];

        const newTrack: Track = {
          id: crypto.randomUUID(),
          title: this.trackForm.value.title!,
          artist: this.trackForm.value.artist!,
          category: this.trackForm.value.category as any,
          duration: this.currentFileDuration,
          fileData: base64String, // Envoi optimisé
          addedDate: new Date()
        };


        this.store.dispatch(TrackActions.addTrack({ track: newTrack }));
        this.cancelEdit();
      };

      reader.onerror = (error) => {
        console.error('Erreur lors de la lecture du fichier', error);
      };
    }
  }

  confirmDelete(track: Track) {
    if (confirm(`Voulez-vous vraiment supprimer "${track.title}" ?`)) {
      this.store.dispatch(TrackActions.deleteTrack({ id: track.id }));
    }
  }

  // --- HELPERS FORMULAIRE ---
  editTrack(track: Track) {
    this.isEditing = true;
    this.currentTrackId = track.id;
    this.trackForm.patchValue({
      title: track.title,
      artist: track.artist,
      category: track.category
    });
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

  playTrack(track: Track) {
    this.playerService.playTrack(track);
  }
}
