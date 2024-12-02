import { Component, Input, input } from '@angular/core';
import { Artist } from '../../../../interfaces/artist-api';

@Component({
  selector: 'app-artist-table',
  standalone: true,
  imports: [],
  templateUrl: './artist-table.component.html',
  styleUrl: './artist-table.component.css',
})
export class ArtistTableComponent {
  @Input()
  artist: Artist = {
    name: 'jane', // Nombre aleatorio de artista
    artistId: 'sdf', // ID aleatorio
    images: [
      'https://i.scdn.co/image/ab67616d0000b2737b5d0847242e0c59b35bb2ee',
    ],
    popularity: Math.floor(Math.random() * 100), // Popularidad aleatoria entre 0 y 100
    genres: ['Pop', 'Indie', 'Alternative'], // Géneros aleatorios
    spotifyUrl: 'https://open.spotify.com/artist/4XjLwb3M7UiD8zKr1yFiWz', // Enlace aleatorio de Spotify
    followers: Math.floor(Math.random() * 1000000), // Número de seguidores aleatorio entre 0 y 1 millón
  };
}
