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
  on(TrackActions.loadTracksSuccess, (state, { tracks }) => ({ ...state, tracks })),
  on(TrackActions.loadTracksFailure, (state, { error }) => ({ ...state, error }))
);
