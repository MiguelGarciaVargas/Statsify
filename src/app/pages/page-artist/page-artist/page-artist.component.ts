import { Component, OnInit } from '@angular/core';
import { TitleBarComponent } from '../../../components/title-bar/title-bar/title-bar.component';
import { ActivatedRoute } from '@angular/router';
import { Artist } from '../../../interfaces/artist-api';
import { CardMostListComponent } from '../../../components/card-most-list/card-most-list/card-most-list.component';
import { Porcentage } from '../../../interfaces/porcentage';
import { environment } from '../../../../environments/environment';
import { Item } from '../../../interfaces/item';
import { WeeklyData } from '../../../interfaces/weekly-data';

@Component({
  selector: 'app-page-artist',
  standalone: true,
  imports: [TitleBarComponent, TitleBarComponent, CardMostListComponent],
  templateUrl: './page-artist.component.html',
  styleUrls: ['./page-artist.component.css'], // Asegúrate de que esto esté escrito correctamente
})
export class PageArtistComponent implements OnInit {
  artistItem: Item = { id: '123', name: 'jane' };
  artistData: Artist = {
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
  topArtists: Item[] = [];
  topArtistsPercentage: Porcentage[] = [];

  topTracks: Item[] = [];

  weeklyTimes: WeeklyData[] = [
    {
      datasetName: 'Month',
      data: [
        { name: 'Week 0', id: '79.23' },
        { name: 'Week 1', id: '82.5' },
        { name: 'Week 2', id: '78.9' },
      ],
    },
  ];

  accessToken: string = '';

  clientId = environment.spotifyClientId; // Usa el Client ID de desarrollo
  clientSecret = environment.spotifyClientSecret; // Usa el Client Secret de desarrollo
  redirectUri = environment.spotifyRedirectUri; // Usa la URL de redirección para desarrollo

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      // console.log(params); // Agrega esto para verificar los parámetros
      this.artistItem.id = params['input'] || 'noArtist'; // Asigna directamente el nombre del artista
      // Recuperar el token de localStorage si existe
      const token = localStorage.getItem('spotifyAccessToken');
      if (token) {
        this.accessToken = token; // Usar el token recuperado
        this.loadUserData(); // Llamamos a la función que obtiene todos los datos
      }
    });
  }

  // Función que carga todos los datos del usuario
  loadUserData(): void {
    // this.getUserData(); // Obtener los datos del usuario
    // this.getUserTopTracks(); // Obtener las canciones más escuchadas
    this.getArtistData(this.artistItem.id); // Obtener los artistas más escuchados
    this.getTopArtistsPercentage(); // Llamamos para obtener las playlists del usuario
    this.getRecentTracks();
    this.getUserTopArtists();
    this.getTopTracks(this.artistItem.id);
  }

  getArtistData(artistId: string): void {
    const artistUrl = `https://api.spotify.com/v1/artists/${artistId}`;

    fetch(artistUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.accessToken}`, // Usamos el token de acceso en el encabezado
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Aquí procesamos los datos y los asignamos a artistData
        this.artistData = {
          name: data.name,
          artistId: data.id,
          images: data.images.map((img: any) => img.url),
          popularity: data.popularity,
          genres: data.genres,
          spotifyUrl: data.external_urls.spotify,
          followers: data.followers.total,
        };
        // console.log('Artist Data:', this.artistData); // Muestra la información del artista en consola
      })
      .catch((error) => {
        console.error('Error obteniendo los datos del artista:', error);
      });
  }

  // Obtener los top tracks del artista
  getTopTracks(artistId: string): void {
    const country = 'US'; // Cambia esto por el país que desees (por ejemplo, 'US' para Estados Unidos)
    const topTracksUrl = `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=${country}`;

    fetch(topTracksUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.accessToken}`, // Usamos el token de acceso en el encabezado
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Procesar los top tracks
        this.topTracks = data.tracks.map((track: any) => ({
          name: track.name, // Nombre de la canción
          id: track.artists[0].id, // ID del primer artista (puedes adaptar esto si es necesario)
        }));
        // console.log('Top Tracks:', this.topTracks); // Mostrar los top tracks
      })
      .catch((error) => {
        console.error('Error obteniendo los top tracks del artista:', error);
      });
  }

  // Método para obtener los artistas más escuchados del usuario
  getUserTopArtists(): void {
    const topArtistsUrl = 'https://api.spotify.com/v1/me/top/artists'; // Endpoint para obtener los artistas más escuchados

    fetch(topArtistsUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.topArtists = data.items
          .map((artist: any) => ({
            name: artist.name, // Nombre del artista
            id: artist.id, // ID del artista
          }))
          .filter((artist: any) => artist.id !== this.artistItem.id);
        this.topArtists = this.shuffleArray(this.topArtists).slice(0, 2);
        // console.log('top Artiwsts', this.topArtists);
      })
      .catch((error) => {
        console.error('Error obteniendo los artistas más escuchados:', error);
      });
  }

  getTopArtistsPercentage(): void {
    const savedTracksUrl = 'https://api.spotify.com/v1/me/tracks'; // Endpoint para obtener las canciones guardadas

    fetch(savedTracksUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.accessToken}`, // Usamos el token de acceso en el encabezado
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Procesamos las canciones guardadas
        const savedTracks = data.items.map((track: any) => ({
          name: track.track.name,
          artist: track.track.artists[0].name,
          artistId: track.track.artists[0].id,
          spotifyUrl: track.track.external_urls.spotify,
        }));

        // Contamos cuántas canciones de cada artista
        const artistCounts: { [key: string]: number } = {};
        savedTracks.forEach((track: any) => {
          if (artistCounts[track.artistId]) {
            artistCounts[track.artistId]++;
          } else {
            artistCounts[track.artistId] = 1;
          }
        });

        // Obtenemos el total de canciones guardadas
        const totalTracks = savedTracks.length;
        // console.log('Total de canciones guardadas:', totalTracks);

        // Calculamos el porcentaje para cada artista
        const artistPercentages = Object.keys(artistCounts).map((artistId) => ({
          artistId,
          name: savedTracks.find((track: any) => track.artistId === artistId)
            ?.artist,
          percentage: ((artistCounts[artistId] / totalTracks) * 100).toFixed(2),
        }));

        // Ordenamos los artistas por el porcentaje en orden descendente
        artistPercentages.sort(
          (a, b) => parseFloat(b.percentage) - parseFloat(a.percentage)
        );

        // Ahora obtenemos el top 10 artistas
        const top10Artists = artistPercentages.slice(0, 8);

        // Si el artista específico está en el top 10, mostramos solo el top 10
        if (
          top10Artists.find((artist) => artist.artistId === this.artistItem.id)
        ) {
          // console.log('Top 10 artists:', top10Artists);
          this.topArtistsPercentage = top10Artists.map((artist) => ({
            item: {
              name: artist.name,
              id: artist.artistId,
            },
            percentage: artist.percentage,
          }));
        } else {
          // Si no está en el top 10, mostramos el top 10 más el artista específico
          const artistInfo = artistPercentages.find(
            (artist) => artist.artistId === this.artistItem.id
          );
          if (artistInfo) {
            top10Artists.push(artistInfo); // Agregar el artista específico al final
          }
          // console.log('Top 10 artists + specific artist:', top10Artists);
          this.topArtistsPercentage = top10Artists.map((artist) => ({
            item: {
              name: artist.name,
              id: artist.artistId,
            },
            percentage: artist.percentage,
          }));
        }
      })
      .catch((error) => {
        console.error('Error obteniendo las canciones guardadas:', error);
      });
  }

  getRecentTracks(): void {
    const recentTracksUrl =
      'https://api.spotify.com/v1/me/player/recently-played';

    fetch(recentTracksUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        let totalListeningTime = 0;
        let artistTrackCount = 0; // Variable para contar las canciones del artista específico

        // Iterar sobre las canciones recientes
        data.items.forEach((track: any) => {
          // Verificar si el artista de la canción coincide con el artistId
          const artistId = track.track.artists[0]?.id; // Obtener el ID del artista de la canción
          if (artistId === this.artistItem.id) {
            totalListeningTime += track.track.duration_ms; // Sumar la duración solo si es del artista específico
            artistTrackCount++; // Incrementar el contador si es el artista específico
          }
        });

        // Si no hay canciones del artista, asignar un valor por defecto (1 minuto y 1 canción)
        if (artistTrackCount === 0) {
          totalListeningTime = 1; // Asignar 1 minuto
          artistTrackCount = 1; // Asignar 1 canción
        }

        // Convertir milisegundos a minutos
        const totalMinutes = (totalListeningTime / 60000).toFixed(2); // 60000 ms = 1 minuto

        // Crear un objeto WeeklyData para este artista
        const weeklyData: WeeklyData = {
          datasetName: `Artist - ${this.artistItem.name}`,
          data: [
            {
              name: `Recent Tracks for ${this.artistItem.name}`,
              id: totalMinutes,
            },
          ],
        };

        // Aquí puedes añadirlo a tu array weeklyTimes
        this.weeklyTimes.push(weeklyData);
      })
      .catch((error) => {
        console.error('Error obteniendo las canciones recientes:', error);
      });
  }

  // Función para hacer un shuffle en el array
  shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Obtener un índice aleatorio
      [array[i], array[j]] = [array[j], array[i]]; // Intercambiar los elementos
    }
    return array;
  }
}
