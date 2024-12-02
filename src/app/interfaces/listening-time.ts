export interface ListeningTime {
  time: number; // El tiempo de escucha en minutos
  date: string; // La fecha de la escucha
}

export interface SaveListeningTimeResponse {
  success: boolean;
  message: string;
}
