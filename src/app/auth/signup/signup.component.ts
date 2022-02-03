import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { SnackbarNotificationComponent } from 'src/app/shared/snackbar-notification/snackbar-notification.component';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['../auth.styles.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  private authListenerSubs: Subscription;
  authStatus: { isConnected: boolean; message: String };

  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.authStatus = authStatus;
    });

    if (this.authService.getIsAuth()) {
      this.router.navigate(['/']);

      this.snackBar.openFromComponent(SnackbarNotificationComponent, {
        duration: 4000,
        data: {
          message: 'Vous êtes déjà inscrit.',
          image: 'assets/icons/user.svg'
        }
      });
    }
  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.authService.signupUser(form.value.email, form.value.password);
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
