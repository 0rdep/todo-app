import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private http: HttpClient) {}

  uploadImage(formdata: any) {
    return this.http.post(`${environment.backendUrl}/profile/avatar`, formdata);
  }

  getImage() {
    return this.http
      .get(`${environment.backendUrl}/profile/avatar`, {
        responseType: 'blob',
        observe: 'response',
      })
      .pipe(map((r) => r.body));
  }
}
