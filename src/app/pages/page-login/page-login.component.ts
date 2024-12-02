import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-page-login',
  standalone: true,
  imports: [],
  templateUrl: './page-login.component.html',
  styleUrl: './page-login.component.css',
})
export class PageLoginComponent {
  clientId = environment.spotifyClientId; // Usa el Client ID de desarrollo
  redirectUri = environment.spotifyRedirectUri;

  scope =
    'user-top-read user-read-private user-library-read playlist-read-private playlist-read-collaborative user-read-recently-played';
  // Los permisos que se piden al usuario

  // Método que redirige al usuario a la página de autenticación de Spotify
  loginWithSpotify(): void {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${this.clientId}&response_type=code&redirect_uri=${this.redirectUri}&scope=${this.scope}`;

    // Redirige al usuario a la URL de autenticación de Spotify
    window.location.href = authUrl;
    console.log(authUrl);
  }
}
