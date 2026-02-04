import { createReducer, on } from '@ngrx/store';
import { TrackActions } from './track.actions';
import {Track} from '../../shared/components/models/track.model';

export interface TrackState {
  tracks: Track[];
  error: string | null;
}

export const initialState: TrackState = {
  tracks: [],
  error: null
};

export const trackReducer = createReducer(
  initialState,
  on(TrackActions.addTrackSuccess, (state, { track }) => ({
    ...state,
    tracks: [...state.tracks, track] // Ajoute le nouveau track à la liste existante
  })),
  on(TrackActions.deleteTrackSuccess, (state, { id }) => ({
    ...state,
    tracks: state.tracks.filter(t => t.id !== id)
  })),

  on(TrackActions.updateTrackSuccess, (state, { track }) => ({
    ...state,
    tracks: state.tracks.map(t => t.id === track.id ? track : t)
  })),
  on(TrackActions.loadTracksSuccess, (state, { tracks }) => ({ ...state, tracks })),
  on(TrackActions.loadTracksFailure, (state, { error }) => ({ ...state, error }))
);
