import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { TitleBarComponent } from '../../components/title-bar/title-bar/title-bar.component';
import { CardMostListComponent } from '../../components/card-most-list/card-most-list/card-most-list.component';
import { Porcentage } from '../../interfaces/porcentage';
import { Track } from '../../interfaces/Track';
import { User } from '../../interfaces/user';
import { WeeklyData } from '../../interfaces/weekly-data';
import { ActivatedRoute } from '@angular/router';
import { Artist } from '../../interfaces/artist-api';
import { Item } from '../../interfaces/item';
import { ListeningTimeService } from '../../services/listening-time.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-home',
  standalone: true,
  imports: [TitleBarComponent, CardMostListComponent, CommonModule],
  templateUrl: './page-home.component.html',
  styleUrl: './page-home.component.css',
})
export class PageHomeComponent implements OnInit {
  accessToken: string = '';
  code: string = '';

  clientId = environment.spotifyClientId; // Usa el Client ID de desarrollo
  clientSecret = environment.spotifyClientSecret; // Usa el Client Secret de desarrollo
  redirectUri = environment.spotifyRedirectUri; // Usa la URL de redirección para desarrollo

  //Guardar datos del usuario
  userData: User = {
    country: 'MX',
    display_name: 'Mike',
    explicit_content: {
      filter_enabled: false,
      filter_locked: false,
    },
    external_urls: {
      spotify: 'https://open.spotify.com/user/ohuag3a1uah4emyiczq52ag4o',
    },
    followers: {
      href: null,
      total: 42,
    },
    href: 'https://api.spotify.com/v1/users/ohuag3a1uah4emyiczq52ag4o',
    id: 'ohuag3a1uah4emyiczq52ag4o',
    images: [
      {
        height: 300,
        url: 'https://i.scdn.co/image/ab6775700000ee854da57754b3910b3b0ee8de9a',
        width: 300,
      },
      {
        height: 64,
        url: 'https://i.scdn.co/image/ab67757000003b824da57754b3910b3b0ee8de9a',
        width: 64,
      },
    ],
    product: 'premium',
    type: 'user',
    uri: 'spotify:user:ohuag3a1uah4emyiczq52ag4o',
  };

  //Pic del usuario
  userPic: Item = { name: '', id: '' };

  userTopTracks: Track[] = [
    {
      name: 'MIKOLOnge', // Nombre de la canción
      artist: 'Junior H', // Nombre del primer artista
      albumImage:
        'https://i.scdn.co/image/ab67616d0000b273b9ae53847e3a92d54d045e2b', // URL de la imagen del álbum
      popularity: 72, // Popularidad de la canción
      previewUrl:
        'https://p.scdn.co/mp3-preview/73036d90a222b0ccdf08ed6d3dd01f737419e3ee?cid=4de914bcace94df6a5bbb7d73e4bfd86', // URL de pre-escucha de la canción
      spotifyUrl: 'https://open.spotify.com/track/1ULnQ2yn5LeQX4LrROm1RD', // Enlace de Spotify para escuchar la canción
    },
  ];

  filteredTracks: Item[] = [];

  userTopArtists: Artist[] = [];

  topArtistFiltered: Item[] = [];

  topGenres: Item[] = [];
  percentageGenres: Porcentage[] = [];
  weeklyTimes: WeeklyData[] = [];

  constructor(
    private route: ActivatedRoute,
    private listeningTimeService: ListeningTimeService
  ) {}

  getListeningTimes() {
    this.listeningTimeService
      .getListeningTimes(this.userData.id, this.accessToken)
      .subscribe(
        (data) => {
          this.weeklyTimes = this.transformDataForChart(data);
          // console.log('User listening times:', this.weeklyTimes);
        },
        (error) => {
          console.error('Error obteniendo los tiempos de escucha:', error);
        }
      );
  }

  // Función que transforma los datos de la API en el formato adecuado para el gráfico
  transformDataForChart(responseData: any): WeeklyData[] {
    // Mapeamos los datos de `listeningTimes` para convertirlos en el formato adecuado
    const data: Item[] = responseData.listeningTimes.map((item: any) => ({
      name: item.time.toFixed(2), // Minutos de escucha, convertidos a string
      id: new Date(item.date).toISOString(), // Fecha convertida a string
    }));

    // Creamos el objeto WeeklyData con el dataset y los datos
    const weeklyData: WeeklyData = {
      datasetName: 'Tiempo de Escucha Diario',
      data: data,
    };

    return [weeklyData];
  }

  ngOnInit(): void {
    // Recuperar el token de localStorage si existe
    const token = localStorage.getItem('spotifyAccessToken');
    if (token) {
      this.accessToken = token;
      this.loadUserData(); // Llamamos a la función que obtiene todos los datos
    } else {
      this.route.queryParams.subscribe((params) => {
        this.code = params['code'];
        if (this.code) {
          // Si el código está presente, intercámbialo por el token de acceso
          this.exchangeCodeForToken();
        }
      });
    }
  }

  // Método para intercambiar el código de autorización por el token de acceso
  exchangeCodeForToken(): void {
    const tokenUrl = 'https://accounts.spotify.com/api/token';

    const body = new URLSearchParams();
    body.set('grant_type', 'authorization_code');
    body.set('code', this.code);
    body.set('redirect_uri', this.redirectUri);

    const headers = new Headers();
    headers.set(
      'Authorization',
      'Basic ' + btoa(`${this.clientId}:${this.clientSecret}`)
    );
    headers.set('Content-Type', 'application/x-www-form-urlencoded');

    fetch(tokenUrl, {
      method: 'POST',
      headers: headers,
      body: body.toString(),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.access_token) {
          this.accessToken = data.access_token; // Guardamos el token de acceso
          localStorage.setItem('spotifyAccessToken', this.accessToken); // Guardamos el token
          this.loadUserData(); // Llamamos a la función que obtiene los datos del usuario
        } else {
          console.error('Failed to obtain access token:', data);
        }
      })
      .catch((error) => {
        console.error('Error obteniendo el token de acceso:', error);
      });
  }

  // Función que carga todos los datos del usuario
  loadUserData(): void {
    this.getUserData(); // Obtener los datos del usuario
    this.getUserTopTracks(); // Obtener las canciones más escuchadas
    this.getUserTopArtists(); // Obtener los artistas más escuchados
    this.getListeningTimes(); // Obtener los tracks recientes
  }

  // Método para obtener los datos personales del usuario
  getUserData(): void {
    const userUrl = 'https://api.spotify.com/v1/me'; // Endpoint para obtener los datos del usuario

    // Realizar la solicitud GET para obtener los datos del usuario
    fetch(userUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.accessToken}`, // Usamos el token de acceso en el encabezado
      },
    })
      .then((response) => response.json())
      .then((data: User) => {
        this.userData = data; // Asignamos directamente los datos del usuario
        this.userPic.name = this.userData.images[0].url;
        // console.log('User Data:', this.userData);
      })
      .catch((error) => {
        console.error('Error obteniendo los datos del usuario:', error);
      });
  }

  // Método para obtener las canciones más escuchadas del usuario
  getUserTopTracks(): void {
    const topTracksUrl = 'https://api.spotify.com/v1/me/top/tracks'; // Endpoint para obtener las canciones más escuchadas

    // Realizar la solicitud GET para obtener las canciones más escuchadas del usuario
    fetch(topTracksUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.accessToken}`, // Usamos el token de acceso en el encabezado
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.userTopTracks = data.items.map((track: any) => ({
          name: track.name,
          artist: track.artists[0]?.name,
          artistId: track.artists[0]?.id,
          albumImage: track.album.images[0]?.url,
          popularity: track.popularity,
          previewUrl: track.preview_url,
          spotifyUrl: track.external_urls.spotify,
        }));
        // console.log('User Top Tracks:', this.userTopTracks);

        // Filtrar solo los campos name y artistId para enviar al componente
        this.filteredTracks = this.userTopTracks.map((artist: any) => ({
          name: artist.name,
          id: artist.artistId,
        }));
        // console.log('User filtered Top Tracks:', this.filteredTracks);
      })
      .catch((error) => {
        console.error('Error obteniendo las canciones más escuchadas:', error);
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
        this.userTopArtists = data.items.map((artist: any) => ({
          name: artist.name, // Nombre del artista
          artistId: artist.id, // ID del artista
          images: artist.images.map((img: any) => img.url), // Extrae las URLs de todas las imágenes
          popularity: artist.popularity, // Popularidad del artista
          genres: artist.genres, // Géneros del artista
          spotifyUrl: artist.external_urls.spotify, // Enlace a Spotify del artista
          followers: artist.followers.total, // Número de seguidores del artista
        }));
        // console.log('User Top Artists:', this.userTopArtists); // Muestra los artistas en la consola

        // Filtrar solo los campos name y artistId para enviar al componente
        this.topArtistFiltered = this.userTopArtists.map((artist: any) => ({
          name: artist.name,
          id: artist.artistId,
        }));

        let genres: string[] = [];

        // Extraer los géneros de los artistas
        data.items.forEach((artist: any) => {
          genres = [...genres, ...artist.genres]; // Agregar los géneros de cada artista
        });

        // Contamos la frecuencia de cada género
        const genreCount = this.countGenres(genres);

        // Convertimos la cuenta de géneros a un array de Items (name y id)
        this.topGenres = Object.entries(genreCount).map(([name, count]) => ({
          name, // Nombre del género
          id: count.toString(), // La cantidad de veces que aparece el género
        }));

        this.reworkGenres();

        // console.log('Filtered Artists:', this.topArtistFiltered);
      })
      .catch((error) => {
        console.error('Error obteniendo los artistas más escuchados:', error);
      });
  }

  // Método para contar la frecuencia de los géneros
  countGenres(genres: string[]): { [key: string]: number } {
    return genres.reduce((acc: { [key: string]: number }, genre: string) => {
      acc[genre] = (acc[genre] || 0) + 1; // Cuenta las ocurrencias de cada género
      return acc;
    }, {});
  }

  reworkGenres() {
    // Ordenar los géneros por la cantidad de veces que se escuchan (id)
    this.topGenres.sort((a, b) => parseInt(b.id) - parseInt(a.id));

    // Quedarse solo con los primeros 10 géneros
    this.topGenres = this.topGenres.slice(0, 8);

    // Sumar todas las frecuencias (id) de los primeros 10 géneros
    const totalFrequency = this.topGenres.reduce(
      (sum, genre) => sum + parseInt(genre.id),
      0
    );

    // Convertir de Item a Porcentage
    this.percentageGenres = this.convertToPercentageFormat(
      this.topGenres,
      totalFrequency
    );

    // Mostrar los géneros con su porcentaje
    // console.log('Porcentage genre', this.percentageGenres);
  }

  // Función para convertir un Item a Porcentage
  convertToPercentageFormat(items: Item[], total: number): Porcentage[] {
    return items.map((item: Item) => ({
      item: item, // Mantiene el item tal como está
      percentage: ((parseInt(item.id) / total) * 100).toFixed(2), // Calcula el porcentaje
    }));
  }
}
