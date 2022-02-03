import { Inject, Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatDialog } from '@angular/material';
import { ErrorComponent } from './error/error.component';

// Imporation des variables d'environnement
import { environment } from '../environments/environment';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An error has occured!';

        if (error.error.message) {
          errorMessage = error.error.message;
        } else {
          // S'il n'y a pas de message, j'ajoute le message par défaut pour qu'un message soit retourné dans le cas où on n'utiliserait pas le popup.
          error.error.message = errorMessage;
        }

        /**
         *  Ce switch nous permet d'entrer les routes pour lesquelles on ne veut pas
         *  utiliser la gestion des erreurs par popups.
         */
        switch (req.url) {
          case environment.apiUrl + '/users/login':
          case environment.apiUrl + '/users/signup':
            break;
          default:
            // Par défaut, les erreurs obtenues vont apparaîtres dans des popups
            this.dialog.open(ErrorComponent, {
              data: { message: errorMessage },
            });
        }

        return throwError(error);
      })
    );
  }
}
