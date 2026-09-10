import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Publicacion } from '../models/publicacion.model';

@Injectable({
  providedIn: 'root',
})
export class PublicacionService {
  private readonly baseUrl = `${environment.apiConfig.protocol}://${environment.apiConfig.host}:${environment.apiConfig.port}/api/v1/api/publicaciones`;

  constructor(private http: HttpClient) {}

  // El token JWT se agrega automaticamente via authInterceptor. Endpoint
  // dedicado en backend: filtra por usuario del token (@AuthenticationPrincipal),
  // devuelve un array plano.
  getMisPublicaciones(): Observable<Publicacion[]> {
    return this.http.get<Publicacion[]>(`${this.baseUrl}/mis-publicaciones`);
  }
}
