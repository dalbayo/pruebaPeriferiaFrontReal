import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import {
  MatDialogModule,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
  MatDialogRef,
} from '@angular/material/dialog';
import { AuthApiService } from '../../services/auth-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
  ],
  templateUrl: './logout-dialog.component.html',
  styleUrl: './logout-dialog.component.scss',
})
export class LogoutDialogComponent {
  constructor(
    private authApiService: AuthApiService,
    private router: Router,
    private dialogRef: MatDialogRef<LogoutDialogComponent>,
  ) {}

  confirmLogout() {
    this.authApiService.logout();
    this.router.navigate(['/']);
    this.dialogRef.close();
  }
}
