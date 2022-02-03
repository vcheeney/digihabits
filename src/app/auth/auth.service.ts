import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

// Importation des modèles
import { User } from './user.model';
import { AuthData } from './auth-data.model';

// Imporation des variables d'environnement
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/users/';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Informations à conserver à propos de l'usager et de sa session d'utilisation.
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;

  private user: User;

  private authStatusListener = new Subject<{
    isConnected: boolean;
    message: string;
  }>();

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Retourne le token de l'usager.
   */
  getToken() {
    return this.token;
  }

  /**
   * Retourne "true" si l'usager est connecté, "false" autrement.
   * Cette méthode est appelée dans le AuthGuard (auth.guard.ts).
   */
  getIsAuth() {
    return this.isAuthenticated;
  }

  /**
   * Retourne l'Id de l'usager.
   */
  getUserId() {
    return this.user._id;
  }

  getUserInfo() {
    return this.user;
  }

  /**
   * Permet aux components de s'abonner aux updates du statut d'authentification de l'usager.
   */
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  /**
   * Crée un nouvel usager.
   */
  signupUser(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };

    this.http.post(BACKEND_URL + 'signup', authData).subscribe(
      () => {
        this.loginUser(email, password);
        this.router.navigate(['/']);
      },
      error => {
        this.authStatusListener.next({
          isConnected: false,
          message: error.error.message
        });
      }
    );
  }

  /**
   * Connecte l'usager.
   */
  loginUser(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };

    this.http
      .post<{
        message: string;
        token: string;
        expiresIn: number;
        user: User;
      }>(BACKEND_URL + 'login', authData)
      .subscribe(
        response => {
          this.token = response.token;
          if (this.token) {
            const expiresInDuration = response.expiresIn;
            const now = new Date();
            const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
            this.setAutoLogout(expirationDate);

            this.isAuthenticated = true;
            this.user = response.user;

            this.authStatusListener.next({
              isConnected: true,
              message: response.message
            });
            this.saveAuthData(this.token, expirationDate, this.user);
            this.router.navigate(['/habits']);
          }
        },
        error => {
          this.authStatusListener.next({
            isConnected: false,
            message: error.error.message
          });
        }
      );
  }

  /**
   * Connecte automatiquement l'usager si ces informations sont présentes dans le local storage.
   * Cette méthode est appelée depuis app.component.ts, le premier component lancé lors de l'ouverture de l'app.
   */
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();

    if (authInformation.expirationDate > now) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.user = authInformation.user;
      this.setAutoLogout(authInformation.expirationDate);
      this.authStatusListener.next({
        isConnected: true,
        message: 'Authentification réussi'
      });
    }
  }

  /**
   * Déconnecte l'usager.
   */
  logoutUser() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next({
      isConnected: false,
      message: 'Déconnexion réussi'
    });
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.user = null;
    this.router.navigate(['/']);
  }

  /**
   * Met à jour l'utilisateur.
   */
  updateUser(user: User) {
    this.http.post(BACKEND_URL + '/update', user).subscribe(response => {
      // TODO: À revoir! Je mets ça ici car pour l'instant ça me permet d'actualiser les initiales de mon user connecté dans le header.
      this.authStatusListener.next({
        isConnected: true,
        message: 'Authentification réussi'
      });

      this.router.navigate(['/habits']);
    });
  }

  /**
   * Crée un timer qui lancera la déconnexion de l'usager à la fin de celui-ci.
   */
  private setAutoLogout(expirationDate: Date) {
    const now = new Date();
    const duration = expirationDate.getTime() - now.getTime();
    this.tokenTimer = setTimeout(() => {
      this.logoutUser();
    }, duration);
  }

  /**
   * Sauvegarde les données de l'usager dans le localstorage.
   */
  private saveAuthData(token: string, expirationDate: Date, user: User) {
    localStorage.setItem('token', token);
    localStorage.setItem('expirationDate', expirationDate.toISOString());
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Efface les données de l'usager du local storage.
   */
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('user');
  }

  /**
   * Obtient les données de l'utilisateur dans le local storage.
   */
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expirationDate');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      user: user
    };
  }
}
