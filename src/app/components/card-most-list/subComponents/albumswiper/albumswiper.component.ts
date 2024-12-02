import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { AlbumImages } from '../../../../interfaces/album-images';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-albumswiper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './albumswiper.component.html',
  styleUrls: ['./albumswiper.component.css'],
})
export class AlbumswiperComponent implements OnInit, OnChanges {
  @Input()
  artistId: string = '';

  accessToken: string = '';

  albumImages: AlbumImages[] = [];

  ngOnInit(): void {
    // Recuperar el token de localStorage si existe
    const token = localStorage.getItem('spotifyAccessToken');
    if (token) {
      this.accessToken = token; // Usar el token recuperado
      this.getArtistAlbums(this.artistId); // Llamamos a la función que obtiene todos los datos
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['artistId'] && changes['artistId'].currentValue) {
      this.getArtistAlbums(changes['artistId'].currentValue); // Llamar la función al cambiar artistId
    }
  }

  getArtistAlbums(artistId: string): void {
    const albumsUrl = `https://api.spotify.com/v1/artists/${artistId}/albums`;

    fetch(albumsUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.accessToken}`, // Usamos el token de acceso en el encabezado
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Albums:', data); // Muestra los datos de los álbumes en consola

        // Filtrar los álbumes donde album_group sea 'single' y extraer la primera imagen
        this.albumImages = data.items
          .filter(
            (album: any) =>
              album.album_group === 'album' || album.album_group === 'single'
          ) // Filtramos solo los 'singles'
          .map((album: any) => ({
            id: album.id,
            name: album.name,
            imgURl: album.images[0].url, // Usamos la primera imagen
            externalUrl: album.external_urls.spotify, // URL del álbum en Spotify
            height: album.images[0].height,
            width: album.images[0].width,
          }));

        console.log('Filtered Albums:', this.albumImages); // Muestra los álbumes filtrados
      })
      .catch((error) => {
        console.error('Error obteniendo los álbumes del artista:', error);
      });
  }
}
