import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { SnackbarNotificationComponent } from 'src/app/shared/snackbar-notification/snackbar-notification.component';
import { MatSnackBar } from '@angular/material';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['../auth.styles.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  private authListenerSubs: Subscription;
  authStatus: { isConnected: boolean; message: String };

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.authStatus = authStatus;
      });

    if (this.authService.getIsAuth()) {
      this.router.navigate(['/']);

      this.snackBar.openFromComponent(SnackbarNotificationComponent, {
        duration: 4000,
        data: {
          message: 'Vous are already logged in.',
          image: 'assets/icons/user.svg',
        },
      });
    }
  }

  /**
   * Appelle le service pour connecter l'usager
   * @param loginForm Formulaire de login
   */
  onLogin(form: NgForm) {
    this.authService.loginUser(form.value.email, form.value.password);
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
