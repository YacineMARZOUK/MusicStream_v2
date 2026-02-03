import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {Track} from '../../shared/components/models/track.model';

export const TrackActions = createActionGroup({
  source: 'Track API',
  events: {
    'Load Tracks': emptyProps(),
    'Load Tracks Success': props<{ tracks: Track[] }>(),
    'Load Tracks Failure': props<{ error: string }>(),

    'Add Track': props<{ track: Track }>(),
    'Add Track Success': props<{ track: Track }>(),

    'Update Track': props<{ id: string, updates: Partial<Track> }>(), // Résout ton problème
    'Update Track Success': props<{ track: Track }>(),

    'Delete Track': props<{ id: string }>(),
    'Delete Track Success': props<{ id: string }>(),
  }
});
