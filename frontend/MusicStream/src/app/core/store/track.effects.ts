import {TrackActions} from './track.actions';
import {Injectable} from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {catchError, map, mergeMap, of} from 'rxjs';
import {TrackService} from '../services/TrackService';


@Injectable()
export class TrackEffects {
  loadTracks$ = createEffect(() => this.actions$.pipe(
    ofType(TrackActions.loadTracks),
    mergeMap(() => this.trackService.getTracks().pipe(
      map(tracks => TrackActions.loadTracksSuccess({ tracks })),
      catchError(error => of(TrackActions.loadTracksFailure({ error: error.message })))
    ))
  ));
  deleteTrack$ = createEffect(() => this.actions$.pipe(
    ofType(TrackActions.deleteTrack),
    mergeMap(({ id }) => this.trackService.deleteTrack(id).pipe(
      map(() => TrackActions.deleteTrackSuccess({ id })),
      catchError(error => of(TrackActions.loadTracksFailure({ error: error.message })))
    ))
  ));
  updateTrack$ = createEffect(() => this.actions$.pipe(
    ofType(TrackActions.updateTrack),
    mergeMap(({ id, updates }) => this.trackService.updateTrack(id, updates).pipe(
      map(track => TrackActions.updateTrackSuccess({ track })),
      catchError(error => of(TrackActions.loadTracksFailure({ error: error.message })))
    ))
  ));

  constructor(private actions$: Actions, private trackService: TrackService) {}
}
