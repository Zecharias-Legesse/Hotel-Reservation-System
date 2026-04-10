import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule, MatDividerModule, MatIconModule],
  styles: [`
    .login-page {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 64px);
      background: linear-gradient(160deg, #1e3a0c 0%, #2D5016 40%, #3a6b1c 70%, #2a4a12 100%);
      padding: 24px;
    }
    .login-card {
      width: 420px;
      border-radius: 20px !important;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0,0,0,0.35) !important;
    }
    .login-header {
      background: rgba(0,0,0,0.15);
      color: white;
      padding: 36px 32px 28px;
      text-align: center;
      border-bottom: 1px solid rgba(201,147,26,0.3);
    }
    .logo-circle {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: rgba(255,255,255,0.1);
      border: 2px solid rgba(201,147,26,0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      margin: 0 auto 16px;
    }
    .login-header h1 {
      margin: 0 0 2px;
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .gold-line {
      width: 40px;
      height: 2px;
      background: #C9931A;
      margin: 8px auto;
    }
    .login-header p {
      margin: 0;
      font-size: 12px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      opacity: 0.7;
    }
    .login-body { padding: 32px; background: white; }
    .full-width { width: 100%; }
    .login-btn {
      height: 48px;
      font-size: 15px;
      font-weight: 600;
      border-radius: 100px !important;
      background: #2D5016 !important;
      color: white !important;
      letter-spacing: 0.5px;
    }
    .login-btn:hover { background: #4A7A25 !important; }
    .google-btn {
      height: 44px;
      border-radius: 100px !important;
      border-color: #EDE5D8 !important;
      color: #3D2B1F !important;
    }
    .divider-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 20px 0;
      color: #B8AFA6;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    .divider-row::before, .divider-row::after {
      content: '';
      flex: 1;
      height: 1px;
      background: #EDE5D8;
    }
    .register-link {
      text-align: center;
      margin-top: 20px;
      font-size: 13px;
      color: #6B4C36;
    }
    .register-link a { color: #2D5016; font-weight: 600; }
  `],
  template: `
    <div class="login-page">
      <mat-card class="login-card">
        <div class="login-header">
          <div class="logo-circle">🌿</div>
          <h1>Kereyu</h1>
          <div class="gold-line"></div>
          <p>Hill Resort Hotel</p>
        </div>
        <div class="login-body">
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Username</mat-label>
              <mat-icon matPrefix style="margin-right:8px;color:#aaa">person</mat-icon>
              <input matInput formControlName="username" autocomplete="username">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <mat-icon matPrefix style="margin-right:8px;color:#aaa">lock</mat-icon>
              <input matInput type="password" formControlName="password" autocomplete="current-password">
            </mat-form-field>
            <button type="submit" class="full-width login-btn mat-mdc-raised-button" [disabled]="loading">
              {{ loading ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>
          <div class="divider-row">or</div>
          <button mat-stroked-button type="button" class="full-width google-btn" (click)="loginWithGoogle()" [disabled]="googleLoading">
            <span style="display:flex;align-items:center;justify-content:center;gap:10px">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style="width:18px;height:18px">
              {{ googleLoading ? 'Signing in...' : 'Continue with Google' }}
            </span>
          </button>
          <div class="register-link">
            Don't have an account? <a routerLink="/register">Register here</a>
          </div>
        </div>
      </mat-card>
    </div>
  `
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  googleLoading = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private snackBar: MatSnackBar) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.auth.login(this.form.value).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err.error?.message || 'Login failed', 'Close', { duration: 3000 });
      }
    });
  }

  loginWithGoogle() {
    this.googleLoading = true;
    this.auth.loginWithGoogle().subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.googleLoading = false;
        this.snackBar.open(err.message || 'Google sign-in failed', 'Close', { duration: 3000 });
      }
    });
  }
}
