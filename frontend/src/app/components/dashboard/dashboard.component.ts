import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { JwtResponse } from '../../models/auth.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule],
  styles: [`
    .dashboard-page {
      min-height: calc(100vh - 64px);
      background: #F5F0E8;
      padding: 40px 24px;
    }
    .welcome-banner {
      background: linear-gradient(160deg, #1e3a0c 0%, #2D5016 40%, #3a6b1c 100%);
      color: white;
      border-radius: 16px;
      padding: 36px 40px;
      margin-bottom: 40px;
      display: flex;
      align-items: center;
      gap: 24px;
      box-shadow: 0 8px 32px rgba(45,80,22,0.35);
      position: relative;
      overflow: hidden;
    }
    .welcome-banner::after {
      content: '';
      position: absolute;
      top: -40px; right: -40px;
      width: 200px; height: 200px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(201,147,26,0.08), transparent 70%);
    }
    .avatar-circle {
      width: 64px; height: 64px;
      border-radius: 50%;
      background: rgba(255,255,255,0.1);
      border: 2px solid rgba(201,147,26,0.5);
      display: flex; align-items: center; justify-content: center;
      font-size: 30px; flex-shrink: 0;
    }
    .welcome-text h1 {
      margin: 0 0 4px;
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 26px; font-weight: 700;
    }
    .welcome-text .gold-line { width: 40px; height: 2px; background: #C9931A; margin: 6px 0; }
    .welcome-text p { margin: 0; font-size: 13px; opacity: 0.75; letter-spacing: 0.05em; }
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 20px;
      max-width: 1100px;
      margin: 0 auto;
    }
    .nav-card {
      border-radius: 14px !important;
      cursor: pointer;
      background: white !important;
      border-left: 4px solid transparent;
    }
    .nav-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important; }
    .card-body { padding: 24px !important; }
    .card-icon-wrap {
      width: 52px; height: 52px;
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 14px;
      font-size: 26px;
    }
    .card-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 16px; font-weight: 600;
      margin: 0 0 4px; color: #3D2B1F;
    }
    .card-sub { font-size: 12px; color: #6B4C36; margin: 0 0 18px; }
    .card-btn {
      width: 100%;
      border-radius: 100px !important;
      font-weight: 600 !important;
      font-size: 13px !important;
    }
  `],
  template: `
    <div class="dashboard-page">
      <div style="max-width:1100px;margin:0 auto">
        <div class="welcome-banner">
          <div class="avatar-circle">🌿</div>
          <div class="welcome-text">
            <h1>Welcome, {{ user?.username }}</h1>
            <div class="gold-line"></div>
            <p>{{ isStaff ? 'Administrator · Kereyu Hill Resort Hotel' : 'Guest · Kereyu Hill Resort Hotel' }}</p>
          </div>
        </div>

        <div class="cards-grid">
          <mat-card class="nav-card" style="border-left-color:#2D5016" routerLink="/rooms">
            <mat-card-content class="card-body">
              <div class="card-icon-wrap" style="background:#E8F0DC">🏨</div>
              <div class="card-title">Browse Rooms</div>
              <div class="card-sub">Explore all available rooms</div>
              <button mat-raised-button class="card-btn" style="background:#2D5016;color:white">View Rooms</button>
            </mat-card-content>
          </mat-card>

          @if (!isStaff) {
            <mat-card class="nav-card" style="border-left-color:#C9931A" routerLink="/reservations">
              <mat-card-content class="card-body">
                <div class="card-icon-wrap" style="background:#FFF8E1">📅</div>
                <div class="card-title">My Reservations</div>
                <div class="card-sub">View and manage your bookings</div>
                <button mat-raised-button class="card-btn" style="background:#C9931A;color:white">My Reservations</button>
              </mat-card-content>
            </mat-card>
          }

          @if (isStaff) {
            <mat-card class="nav-card" style="border-left-color:#C9931A" routerLink="/admin">
              <mat-card-content class="card-body">
                <div class="card-icon-wrap" style="background:#FFF8E1">📊</div>
                <div class="card-title">Admin Dashboard</div>
                <div class="card-sub">Stats and hotel overview</div>
                <button mat-raised-button class="card-btn" style="background:#C9931A;color:white">Open Dashboard</button>
              </mat-card-content>
            </mat-card>

            <mat-card class="nav-card" style="border-left-color:#4A7A25" routerLink="/reservations">
              <mat-card-content class="card-body">
                <div class="card-icon-wrap" style="background:#E8F0DC">📋</div>
                <div class="card-title">Manage Reservations</div>
                <div class="card-sub">Approve, check-in, check-out</div>
                <button mat-raised-button class="card-btn" style="background:#4A7A25;color:white">Manage</button>
              </mat-card-content>
            </mat-card>

            <mat-card class="nav-card" style="border-left-color:#6B4C36" routerLink="/rooms/new">
              <mat-card-content class="card-body">
                <div class="card-icon-wrap" style="background:#F5F0E8">🛏️</div>
                <div class="card-title">Add Room</div>
                <div class="card-sub">Create a new hotel room</div>
                <button mat-raised-button class="card-btn" style="background:#6B4C36;color:white">Add Room</button>
              </mat-card-content>
            </mat-card>
          }
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  user: JwtResponse | null = null;
  isStaff = false;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.auth.currentUser$.subscribe(u => {
      this.user = u;
      this.isStaff = this.auth.isStaff();
    });
  }
}
