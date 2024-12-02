// src/app/services/listening-time.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  ListeningTime,
  SaveListeningTimeResponse,
} from '../interfaces/listening-time';

@Injectable({
  providedIn: 'root',
})
export class ListeningTimeService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Función para guardar el tiempo de escucha
  saveListeningTime(
    userId: string,
    time: number,
    accessToken: string
  ): Observable<SaveListeningTimeResponse> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http
      .post<SaveListeningTimeResponse>(
        `${this.apiUrl}/saveListeningTime`,
        { userId, time },
        { headers }
      )
      .pipe(
        catchError((error) => {
          console.error('Error saving time:', error);
          return of({ success: false, message: 'Error saving listening time' });
        })
      );
  }

  getListeningTimes(
    userId: string,
    accessToken: string
  ): Observable<ListeningTime[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http
      .get<ListeningTime[]>(`${this.apiUrl}/getListeningTimes/${userId}`, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.error('Error fetching times:', error);
          return of([]); // Devolvemos un array vacío en caso de error
        })
      );
  }
}
