import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public form: FormGroup;
  public submitting = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    public toastController: ToastController
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.authenticationService.isAuthenticated.subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigate(['private', 'home']);
      }
    });
  }

  async submit() {
    if (!this.form.valid || this.submitting) {
      return;
    }

    this.submitting = true;
    this.authenticationService
      .login(this.form.value)
      .pipe(finalize(() => (this.submitting = false)))
      .subscribe(
        () => {},
        async (err: HttpErrorResponse) => {
          let toast: HTMLIonToastElement;
          if (err.status === 401) {
            toast = await this.toastController.create({
              message: 'Invalid username and/or password',
              position: 'bottom',
              duration: 3000,
              color: 'danger',
              header: 'Failed to login',
            });
          } else {
            toast = await this.toastController.create({
              message: 'Failed to connect to server',
              position: 'bottom',
              duration: 3000,
              color: 'danger',
            });
          }
          await toast.present();
        }
      );
  }

  register() {
    this.router.navigate(['public', 'register']);
  }

  hasError(control: string, error: string) {
    const c = this.form.controls[control];
    return c && (c.touched || c.dirty) && c.hasError(error);
  }
}
