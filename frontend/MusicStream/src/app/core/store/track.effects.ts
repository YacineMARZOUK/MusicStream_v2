import {TrackActions} from './track.actions';
import {Injectable} from '@angular/core';
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

  constructor(private actions$: Actions, private trackService: TrackService) {}
}
