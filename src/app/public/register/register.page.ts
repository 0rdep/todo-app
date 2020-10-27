import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public form: FormGroup;
  public submitting = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    public toastController: ToastController
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group(
      {
        username: [
          '',
          Validators.compose([Validators.required, Validators.minLength(6)]),
        ],

        password: [
          '',
          Validators.compose([Validators.required, Validators.minLength(8)]),
        ],

        confirmPassword: [
          '',
          Validators.compose([Validators.required, Validators.minLength(8)]),
        ],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(control: AbstractControl) {
    const password: string = control.get('password').value;
    const confirmPassword: string = control.get('confirmPassword').value;
    if (password !== confirmPassword) {
      control.get('confirmPassword').setErrors({ NoPassswordMatch: true });
    }
  }

  async submit() {
    if (!this.form.valid || this.submitting) {
      return;
    }

    this.submitting = true;
    this.authenticationService
      .register(this.form.value)
      .pipe(finalize(() => (this.submitting = false)))
      .subscribe(
        async () => {
          const toast = await this.toastController.create({
            message: 'Account created!',
            position: 'bottom',
            duration: 3000,
            color: 'success',
          });
          await toast.present();
          this.goToLogin();
        },
        async (err: HttpErrorResponse) => {
          const toast = await this.toastController.create({
            message: 'Failed to connect to server',
            position: 'bottom',
            duration: 3000,
            color: 'danger',
          });
          await toast.present();
        }
      );
  }

  goToLogin() {
    this.router.navigate(['public', 'login']);
  }

  hasError(control: string, error: string) {
    const c = this.form.controls[control];
    return c && (c.touched || c.dirty) && c.hasError(error);
  }
}
