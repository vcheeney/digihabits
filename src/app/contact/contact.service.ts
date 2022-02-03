import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Imporation des variables d'environnement
import { environment } from '../../environments/environment';
const BACKEND_URL = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class ContactService {
  constructor(private http: HttpClient) {}

  visitorWasWarned = false;

  /**
   * Envoie le message passée en paramètre.
   */
  sendMessage(message: any) {
    this.http.post(BACKEND_URL + '/contact/send/', message).subscribe(response => {

    });
  }

  confirmPresence() {
    this.visitorWasWarned = true;
  }

  getPresence() {
    return this.visitorWasWarned;
  }
}
