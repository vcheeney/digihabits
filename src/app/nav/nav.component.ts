import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';

// Importation de mes modèles
import { User } from '../auth/user.model';
import { NavItem } from './navItem.model';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;

  user: User;
  logoText: string;

  menuOptions: any;

  private authListenerSubs: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.userIsAuthenticated = authStatus.isConnected;
      this.checkNameUpdate();
    });
    this.checkNameUpdate();

    this.menuOptions = document.getElementById('menuOptions');
    window.onclick = click => {
      if (this.menuOptions.classList.contains('showed')) {
        if ((<HTMLInputElement>click.target).id !== "menuIcon") {
          this.menuOptions.classList.remove('showed');
        }
      }
    };
  }

  /**
   * Toggle le menu.
   * (Appelée lorsque l'utilisateur appuie sur le bouton hamburger)
   */
  toggleMenu() {
    this.menuOptions.classList.toggle('showed');
  }

  /**
   * Vérifie si le user connecté à un nom.
   */
  checkNameUpdate() {
    this.user = this.authService.getUserInfo();
    if (this.user && this.user.prenom) {
      this.logoText = this.user.prenom.charAt(0) + this.user.nom.charAt(0);
    } else {
      this.logoText = 'AA';
    }
  }

  logout() {
    this.authService.logoutUser();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
