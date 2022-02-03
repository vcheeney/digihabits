import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth/auth.service';

import { User } from '../auth/user.model';
import { MatSnackBar } from '@angular/material';
import { SnackbarNotificationComponent } from '../shared/snackbar-notification/snackbar-notification.component';

@Component({
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit  {
  user: User;

  constructor(private authService: AuthService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.user = this.authService.getUserInfo();
  }

  updateUser(event: any, updateUserForm: NgForm) {
    event.preventDefault();

    if (this.user.email === '') {
      this.snackBar.openFromComponent(SnackbarNotificationComponent, {
        duration: 4000,
        data: {
          message: 'Le courriel est requis.',
          image: 'assets/icons/at.svg'
        }

      });
    } else {
      this.authService.updateUser(this.user);
    }
  }
}
