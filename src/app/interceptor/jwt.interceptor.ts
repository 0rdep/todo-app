import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
} from '@angular/common/http';
import { AuthenticationService } from '../services/authentication.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    public authenticationService: AuthenticationService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.authenticationService.token}`,
      },
    });
    return next.handle(request).pipe(
      catchError(async (err) => {
        if (err.status === 401) {
          await this.authenticationService.logout();
          this.router.navigate(['public', 'login']);
        }

        return err;
      })
    );
  }
}
