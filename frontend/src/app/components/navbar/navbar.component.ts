import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, MatDividerModule],
  styles: [`
    mat-toolbar {
      height: 64px;
      background: #2D5016 !important;
      box-shadow: 0 2px 12px rgba(0,0,0,0.25) !important;
    }
    .brand {
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: white;
    }
    .brand-icon {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(201,147,26,0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }
    .brand-text {
      display: flex;
      flex-direction: column;
      line-height: 1;
    }
    .brand-name {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 17px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .brand-sub {
      font-size: 10px;
      letter-spacing: 0.2em;
      opacity: 0.7;
      text-transform: uppercase;
    }
    .nav-btn {
      font-size: 13px;
      font-weight: 500;
      letter-spacing: 0.3px;
      color: rgba(255,255,255,0.9) !important;
    }
    .nav-btn:hover { color: white !important; }
    .user-chip {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 100px;
      background: rgba(255,255,255,0.12);
      border: 1px solid rgba(255,255,255,0.2);
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      color: white;
    }
    .menu-header {
      padding: 12px 16px 10px;
      border-bottom: 1px solid #eee;
      margin-bottom: 4px;
    }
    .menu-name { font-weight: 600; font-size: 14px; color: #2D5016; }
    .menu-role { font-size: 11px; color: #888; margin-top: 2px; }
    .register-btn {
      background: #C9931A !important;
      color: white !important;
      border-radius: 100px !important;
      font-size: 13px !important;
      font-weight: 600 !important;
    }
  `],
  template: `
    <mat-toolbar>
      <span class="brand" routerLink="/dashboard">
        <div class="brand-icon">🌿</div>
        <div class="brand-text">
          <span class="brand-name">Kereyu</span>
          <span class="brand-sub">Hill Resort Hotel</span>
        </div>
      </span>
      <span style="flex:1"></span>
      @if (auth.isLoggedIn()) {
        <button mat-button class="nav-btn" routerLink="/rooms">Rooms</button>
        @if (auth.isStaff()) {
          <button mat-button class="nav-btn" routerLink="/admin">Dashboard</button>
          <button mat-button class="nav-btn" routerLink="/reservations">Reservations</button>
        } @else {
          <button mat-button class="nav-btn" routerLink="/reservations">My Reservations</button>
        }
        <button mat-button [matMenuTriggerFor]="menu" style="margin-left:8px">
          <div class="user-chip">
            <mat-icon>account_circle</mat-icon>
            <span>{{ (auth.currentUser$ | async)?.username }}</span>
          </div>
        </button>
        <mat-menu #menu="matMenu">
          <div class="menu-header">
            <div class="menu-name">{{ (auth.currentUser$ | async)?.username }}</div>
            <div class="menu-role">{{ (auth.currentUser$ | async)?.roles?.join(', ') }}</div>
          </div>
          <button mat-menu-item routerLink="/profile">
            <mat-icon>manage_accounts</mat-icon> My Profile
          </button>
          <mat-divider></mat-divider>
          <button mat-menu-item (click)="logout()">
            <mat-icon>logout</mat-icon> Sign Out
          </button>
        </mat-menu>
      } @else {
        <button mat-button class="nav-btn" routerLink="/login">Login</button>
        <button mat-raised-button class="register-btn" routerLink="/register" style="margin-left:8px">Register</button>
      }
    </mat-toolbar>
  `
})
export class NavbarComponent {
  constructor(public auth: AuthService, private router: Router) {}

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
