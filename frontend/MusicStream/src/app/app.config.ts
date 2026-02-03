import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient} from '@angular/common/http';
import {TrackEffects} from './core/store/track.effects';
import {trackReducer} from './core/store/track.reducer';
import {provideStore} from '@ngrx/store';
import {provideEffects} from '@ngrx/effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideStore({ tracks: trackReducer }),
    provideEffects([TrackEffects]),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes)
  ]
};
