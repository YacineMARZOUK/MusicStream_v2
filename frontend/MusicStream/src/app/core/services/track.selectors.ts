import { createFeatureSelector, createSelector } from '@ngrx/store';
import {TrackState} from '../store/track.reducer';

export const selectTrackState = createFeatureSelector<TrackState>('tracks');

export const selectAllTracks = createSelector(
  selectTrackState,
  (state: TrackState) => state.tracks
);

export const selectTrackError = createSelector(
  selectTrackState,
  (state: TrackState) => state.error
);
