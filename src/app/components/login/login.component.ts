import { Component, OnInit } from '@angular/core';
import { AuthApiService } from '../../services/auth-api.service';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    JsonPipe,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});
  loginError: string = '';

  constructor(
    private authApiService: AuthApiService,
    private router: Router,
    private fb: FormBuilder,
    private toastService: NgToastService,
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    const { username, password } = this.loginForm.value;

    this.authApiService.login(username, password).subscribe({
      next: () => {
        this.toastService.success(
          'Inicio de sesión exitoso',
          'INICIO DE SESIÓN EXITOSO',
          4000,
        );
        this.router.navigateByUrl('/publicaciones');
      },
      error: (err) => {
        this.loginError = this.getErrorMessage(err);
        this.toastService.danger(
          this.loginError,
          'ERROR DE INICIO DE SESIÓN',
          4000,
        );
      },
    });
  }

  getErrorMessage(err: any): string {
    return (
      err?.error?.message ||
      'Usuario o contraseña incorrectos. Intenta de nuevo.'
    );
  }
}
