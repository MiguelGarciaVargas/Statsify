// artist.interface.ts
// We get this from the api
export interface Artist {
  name: string; // Nombre del artista
  artistId: string; // ID del artista
  images: string[]; // Array de URLs de imágenes
  popularity: number; // Popularidad del artista
  genres: string[]; // Géneros musicales del artista
  spotifyUrl: string; // Enlace de Spotify del artista
  followers: number; // Número de seguidores del artista
}
