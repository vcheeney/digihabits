import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { MatSnackBar } from '@angular/material';
import { SnackbarNotificationComponent } from '../shared/snackbar-notification/snackbar-notification.component';
import { ContactService } from '../contact/contact.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private contactService: ContactService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.contactService.getPresence()) {
      // this.snackBar.openFromComponent(SnackbarNotificationComponent, {
      //   duration: 4000,
      //   data: {
      //     message: 'Application web en cours de développement.',
      //     image: 'assets/icons/dev.svg'
      //   }
      // });
      this.contactService.confirmPresence();
    }
  }

  connectToDemo() {
    if (this.authService.getIsAuth()) {
      this.snackBar.openFromComponent(SnackbarNotificationComponent, {
        duration: 4000,
        data: {
          message: 'You are already logged in!',
          image: 'assets/icons/user.svg',
        },
      });
    } else {
      this.authService.loginUser('compte@demo.test', 'demotest');
      this.snackBar.openFromComponent(SnackbarNotificationComponent, {
        duration: 4000,
        data: {
          message: 'You are logged in to the demo account!',
          image: 'assets/icons/user.svg',
        },
      });
    }
  }

  signup() {
    if (this.authService.getIsAuth()) {
      this.snackBar.openFromComponent(SnackbarNotificationComponent, {
        duration: 4000,
        data: {
          message: 'You are already logged in!',
          image: 'assets/icons/user.svg',
        },
      });
    } else {
      this.router.navigate(['/signup']);
    }
  }
}
