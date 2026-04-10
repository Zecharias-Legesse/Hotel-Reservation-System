import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../services/auth.service';

interface ProfileResponse {
  id: number;
  username: string;
  fullName: string;
  email: string;
  createdAt: string;
  newToken?: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSnackBarModule, MatDividerModule],
  styles: [`
    .profile-page {
      background: #f5f6fa;
      min-height: calc(100vh - 64px);
      padding: 32px 24px;
    }
    .profile-header {
      display: flex;
      align-items: center;
      gap: 20px;
      background: linear-gradient(135deg, #1976d2, #1565c0);
      color: white;
      border-radius: 16px;
      padding: 28px 32px;
      margin-bottom: 28px;
      box-shadow: 0 4px 20px rgba(25,118,210,0.3);
    }
    .avatar {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .avatar mat-icon {
      font-size: 44px;
      width: 44px;
      height: 44px;
    }
    .profile-info h2 {
      margin: 0 0 4px;
      font-size: 22px;
      font-weight: 700;
    }
    .profile-info p {
      margin: 0;
      font-size: 13px;
      opacity: 0.8;
    }
    .section-card {
      border-radius: 12px !important;
      margin-bottom: 20px;
    }
    .section-card mat-card-header {
      padding: 20px 20px 0;
    }
    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #1a1a2e;
    }
    .form-body {
      padding: 16px 20px 20px;
    }
    .full-width { width: 100%; }
    .save-btn { min-width: 120px; }
    .member-since {
      font-size: 12px;
      opacity: 0.75;
      margin-top: 4px;
    }
  `],
  template: `
    <div class="profile-page">
      <div style="max-width:640px;margin:0 auto">

        <div class="profile-header">
          <div class="avatar">
            <mat-icon>person</mat-icon>
          </div>
          <div class="profile-info">
            <h2>{{ profile?.fullName || profile?.username }}</h2>
            <p>{{ profile?.email }}</p>
            <p class="member-since">Member since {{ formatDate(profile?.createdAt) }}</p>
          </div>
        </div>

        <!-- Info form -->
        <mat-card class="section-card">
          <mat-card-header>
            <mat-card-title class="section-title">
              <mat-icon style="vertical-align:middle;margin-right:8px;color:#1976d2">edit</mat-icon>
              Profile Information
            </mat-card-title>
          </mat-card-header>
          <div class="form-body">
            <form [formGroup]="infoForm" (ngSubmit)="saveInfo()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Full Name</mat-label>
                <mat-icon matPrefix style="margin-right:8px;color:#aaa">badge</mat-icon>
                <input matInput formControlName="fullName">
              </mat-form-field>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Username</mat-label>
                <mat-icon matPrefix style="margin-right:8px;color:#aaa">alternate_email</mat-icon>
                <input matInput formControlName="username">
              </mat-form-field>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Email</mat-label>
                <mat-icon matPrefix style="margin-right:8px;color:#aaa">email</mat-icon>
                <input matInput formControlName="email" type="email">
              </mat-form-field>
              <div style="display:flex;justify-content:flex-end">
                <button mat-raised-button color="primary" type="submit" class="save-btn" [disabled]="savingInfo">
                  {{ savingInfo ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </form>
          </div>
        </mat-card>

        <!-- Password form -->
        <mat-card class="section-card">
          <mat-card-header>
            <mat-card-title class="section-title">
              <mat-icon style="vertical-align:middle;margin-right:8px;color:#1976d2">lock</mat-icon>
              Change Password
            </mat-card-title>
          </mat-card-header>
          <div class="form-body">
            <form [formGroup]="passwordForm" (ngSubmit)="savePassword()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Current Password</mat-label>
                <input matInput type="password" formControlName="currentPassword">
              </mat-form-field>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>New Password</mat-label>
                <input matInput type="password" formControlName="newPassword">
              </mat-form-field>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Confirm New Password</mat-label>
                <input matInput type="password" formControlName="confirmPassword">
              </mat-form-field>
              @if (passwordForm.errors?.['mismatch'] && passwordForm.get('confirmPassword')?.touched) {
                <p style="color:#f44336;font-size:12px;margin:-8px 0 12px 4px">Passwords do not match</p>
              }
              <div style="display:flex;justify-content:flex-end">
                <button mat-raised-button color="primary" type="submit" class="save-btn" [disabled]="savingPassword">
                  {{ savingPassword ? 'Updating...' : 'Update Password' }}
                </button>
              </div>
            </form>
          </div>
        </mat-card>

      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  profile: ProfileResponse | null = null;
  infoForm: FormGroup;
  passwordForm: FormGroup;
  savingInfo = false;
  savingPassword = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.infoForm = this.fb.group({
      fullName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.http.get<ProfileResponse>('http://localhost:8080/api/profile').subscribe({
      next: (p) => {
        this.profile = p;
        this.infoForm.patchValue({ fullName: p.fullName, username: p.username, email: p.email });
      },
      error: () => this.snackBar.open('Failed to load profile', 'Close', { duration: 3000 })
    });
  }

  saveInfo() {
    if (this.infoForm.invalid) return;
    this.savingInfo = true;
    this.http.put<ProfileResponse>('http://localhost:8080/api/profile', this.infoForm.value).subscribe({
      next: (p) => {
        this.profile = p;
        this.savingInfo = false;
        if (p.newToken) {
          // Username changed — update stored token so user stays logged in
          localStorage.setItem('token', p.newToken);
          const stored = localStorage.getItem('user');
          if (stored) {
            const user = JSON.parse(stored);
            user.username = p.username;
            user.token = p.newToken;
            localStorage.setItem('user', JSON.stringify(user));
          }
        }
        this.snackBar.open('Profile updated!', 'Close', { duration: 3000 });
      },
      error: (err) => {
        this.savingInfo = false;
        this.snackBar.open(err.error?.message || 'Failed to update profile', 'Close', { duration: 3000 });
      }
    });
  }

  savePassword() {
    if (this.passwordForm.invalid) return;
    this.savingPassword = true;
    const { currentPassword, newPassword } = this.passwordForm.value;
    this.http.put<ProfileResponse>('http://localhost:8080/api/profile', { currentPassword, newPassword }).subscribe({
      next: () => {
        this.savingPassword = false;
        this.passwordForm.reset();
        this.snackBar.open('Password updated!', 'Close', { duration: 3000 });
      },
      error: (err) => {
        this.savingPassword = false;
        this.snackBar.open(err.error?.message || 'Failed to update password', 'Close', { duration: 3000 });
      }
    });
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  private passwordMatchValidator(form: FormGroup) {
    const pw = form.get('newPassword')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return pw === confirm ? null : { mismatch: true };
  }
}
