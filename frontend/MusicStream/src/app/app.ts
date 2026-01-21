import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { PlayerBarComponent } from './shared/components/player-bar/player-bar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PlayerBarComponent, RouterLinkWithHref],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('MusicStream');
}
