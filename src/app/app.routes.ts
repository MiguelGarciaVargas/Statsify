import { Routes } from '@angular/router';
import { PageLoginComponent } from './pages/page-login/page-login.component';
import { PageHomeComponent } from './pages/page-home/page-home.component';
import { PageArtistComponent } from './pages/page-artist/page-artist/page-artist.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: PageLoginComponent },
  { path: 'home', component: PageHomeComponent },

  { path: 'artist', component: PageArtistComponent },
  { path: 'artist/:input', component: PageArtistComponent },
];
