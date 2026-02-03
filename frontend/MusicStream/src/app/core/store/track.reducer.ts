import {TrackActions} from './track.actions';
import {createReducer, on} from '@ngrx/store';
import {Track} from '../../shared/components/models/track.model';

export interface TrackState { tracks: Track[]; loading: boolean; }



export const trackReducer = createReducer(
  initialState,
  on(TrackActions.loadTracks, (state) => ({ ...state, loading: true })),
  on(TrackActions.loadTracksSuccess, (state, { tracks }) => ({ ...state, tracks, loading: false }))
);
