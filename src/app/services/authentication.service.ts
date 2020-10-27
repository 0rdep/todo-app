import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/Storage';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, tap } from 'rxjs/operators';
import LoginRequestDTO from '../dto/login/login-request.dto';
import LoginResponseDTO from '../dto/login/login-response.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private tokenSubject = new BehaviorSubject('');
  private usernameSubject = new BehaviorSubject('');

  constructor(
    private storage: Storage,
    private platform: Platform,
    private http: HttpClient
  ) {
    this.platform.ready().then(() => {
      this.loadToken();
      this.loadUsername();
    });
  }

  async loadUsername() {
    const username = await this.getUsername();
    this.usernameSubject.next(username);
  }

  async getUsername() {
    return await this.storage.get('username');
  }

  private async clearToken() {
    await this.storage.remove('token');
    this.tokenSubject.next('');
  }

  private async setToken(token: string) {
    await this.storage.set('token', token);
    this.tokenSubject.next(token);
  }

  private async getToken() {
    return await this.storage.get('token');
  }

  private async loadToken() {
    const token = await this.getToken();
    this.tokenSubject.next(token);
  }

  get isAuthenticated() {
    return this.tokenSubject.pipe(map((token) => !!token));
  }

  get token() {
    return this.tokenSubject.value;
  }

  get username() {
    return this.usernameSubject.asObservable();
  }

  login(loginRequest: LoginRequestDTO) {
    return this.http
      .post<LoginResponseDTO>(
        `${environment.backendUrl}/auth/login`,
        loginRequest
      )
      .pipe(
        tap((response) => {
          this.setToken(response.accessToken);
          this.setUsername(response.username);
          setTimeout(() => this.clearToken(), response.expiresIn * 1000);
        })
      );
  }

  register(value: any) {
    return this.http.post<LoginResponseDTO>(
      `${environment.backendUrl}/auth/register`,
      value
    );
  }

  async setUsername(username: string) {
    await this.storage.set('username', username);
    this.usernameSubject.next(username);
  }

  async logout() {
    await this.clearToken();
  }
}
