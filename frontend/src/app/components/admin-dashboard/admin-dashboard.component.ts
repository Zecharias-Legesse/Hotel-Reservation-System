import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { RoomService } from '../../services/room.service';
import { ReservationService } from '../../services/reservation.service';
import { RoomResponse } from '../../models/room.model';
import { ReservationResponse } from '../../models/reservation.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatTableModule, MatChipsModule],
  styles: [`
    .admin-page {
      background: #F5F0E8;
      min-height: calc(100vh - 64px);
      padding: 32px 24px;
    }
    .page-header {
      margin-bottom: 32px;
    }
    .page-header h1 {
      margin: 0 0 4px;
      font-size: 26px;
      font-family: 'Playfair Display', Georgia, serif;
      font-weight: 700;
      color: #2D5016;
    }
    .page-header p {
      margin: 0;
      color: #6B4C36;
      font-size: 13px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }
    .stat-card {
      border-radius: 12px !important;
      border-left: 4px solid transparent;
      background: white !important;
    }
    .stat-inner {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px !important;
    }
    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .stat-icon mat-icon {
      font-size: 26px;
      width: 26px;
      height: 26px;
      color: white;
    }
    .stat-info h2 {
      margin: 0 0 2px;
      font-size: 28px;
      font-weight: 700;
      line-height: 1;
    }
    .stat-info p {
      margin: 0;
      font-size: 12px;
      color: #888;
    }
    .quick-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 32px;
    }
    .section-header {
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 16px;
      color: #1a1a2e;
    }
    .table-card {
      border-radius: 12px !important;
      overflow: hidden;
    }
    table { width: 100%; }
    th.mat-header-cell {
      font-weight: 600 !important;
      color: #555 !important;
      font-size: 12px !important;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .status-pill {
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      color: white;
      display: inline-block;
    }
  `],
  template: `
    <div class="admin-page">
      <div style="max-width:1100px;margin:0 auto">
        <div class="page-header">
          <h1>Admin Dashboard</h1>
          <p>Hotel operations overview</p>
        </div>

        <div class="stats-grid">
          <mat-card class="stat-card" style="border-left-color:#1976d2">
            <mat-card-content class="stat-inner">
              <div class="stat-icon" style="background:#1976d2">
                <mat-icon>hotel</mat-icon>
              </div>
              <div class="stat-info">
                <h2>{{ totalRooms }}</h2>
                <p>Total Rooms</p>
              </div>
            </mat-card-content>
          </mat-card>
          <mat-card class="stat-card" style="border-left-color:#4caf50">
            <mat-card-content class="stat-inner">
              <div class="stat-icon" style="background:#4caf50">
                <mat-icon>check_circle</mat-icon>
              </div>
              <div class="stat-info">
                <h2>{{ availableRooms }}</h2>
                <p>Available</p>
              </div>
            </mat-card-content>
          </mat-card>
          <mat-card class="stat-card" style="border-left-color:#f44336">
            <mat-card-content class="stat-inner">
              <div class="stat-icon" style="background:#f44336">
                <mat-icon>do_not_disturb</mat-icon>
              </div>
              <div class="stat-info">
                <h2>{{ occupiedRooms }}</h2>
                <p>Occupied</p>
              </div>
            </mat-card-content>
          </mat-card>
          <mat-card class="stat-card" style="border-left-color:#ff9800">
            <mat-card-content class="stat-inner">
              <div class="stat-icon" style="background:#ff9800">
                <mat-icon>pending_actions</mat-icon>
              </div>
              <div class="stat-info">
                <h2>{{ pendingReservations }}</h2>
                <p>Pending</p>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="quick-actions">
          <button mat-raised-button routerLink="/rooms/new" style="background:#2D5016;color:white;border-radius:100px">
            <mat-icon>add</mat-icon> Add Room
          </button>
          <button mat-raised-button routerLink="/reservations" style="background:#C9931A;color:white;border-radius:100px">
            <mat-icon>assignment</mat-icon> Manage Reservations
          </button>
          <button mat-raised-button routerLink="/rooms" style="background:#4A7A25;color:white;border-radius:100px">
            <mat-icon>meeting_room</mat-icon> Manage Rooms
          </button>
        </div>

        <div class="section-header">Recent Reservations</div>
        <mat-card class="table-card">
          @if (recentReservations.length > 0) {
            <table mat-table [dataSource]="recentReservations">
              <ng-container matColumnDef="reservationNumber">
                <th mat-header-cell *matHeaderCellDef>Reservation #</th>
                <td mat-cell *matCellDef="let r">{{ r.reservationNumber }}</td>
              </ng-container>
              <ng-container matColumnDef="userName">
                <th mat-header-cell *matHeaderCellDef>Guest</th>
                <td mat-cell *matCellDef="let r">{{ r.userName }}</td>
              </ng-container>
              <ng-container matColumnDef="roomNumber">
                <th mat-header-cell *matHeaderCellDef>Room</th>
                <td mat-cell *matCellDef="let r">{{ r.roomNumber }}</td>
              </ng-container>
              <ng-container matColumnDef="checkIn">
                <th mat-header-cell *matHeaderCellDef>Check-in</th>
                <td mat-cell *matCellDef="let r">{{ r.checkInDate }}</td>
              </ng-container>
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let r">
                  <span class="status-pill" [style.background]="getStatusColor(r.status)">{{ r.status }}</span>
                </td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="recentColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: recentColumns"></tr>
            </table>
          } @else {
            <div style="padding:32px;text-align:center;color:#999">
              <mat-icon style="font-size:40px;width:40px;height:40px;opacity:0.4">assignment</mat-icon>
              <p style="margin:8px 0 0">No reservations yet</p>
            </div>
          }
        </mat-card>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  totalRooms = 0;
  availableRooms = 0;
  occupiedRooms = 0;
  pendingReservations = 0;
  recentReservations: ReservationResponse[] = [];
  recentColumns = ['reservationNumber', 'userName', 'roomNumber', 'checkIn', 'status'];

  constructor(
    private roomService: RoomService,
    private reservationService: ReservationService
  ) {}

  ngOnInit() {
    this.roomService.getAllRooms(0, 100).subscribe(page => {
      this.totalRooms = page.totalElements;
      this.availableRooms = page.content.filter(r => r.status === 'AVAILABLE').length;
      this.occupiedRooms = page.content.filter(r => r.status === 'OCCUPIED').length;
    });

    this.reservationService.getAllReservations(0, 10).subscribe(page => {
      const reservations = page.content;
      this.pendingReservations = reservations.filter(r => r.status === 'PENDING').length;
      this.recentReservations = reservations.slice(0, 5);
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'CONFIRMED': return '#4caf50';
      case 'PENDING': return '#ff9800';
      case 'CANCELLED': case 'REJECTED': return '#f44336';
      case 'CHECKED_IN': return '#2196f3';
      case 'CHECKED_OUT': return '#9e9e9e';
      default: return '#000';
    }
  }
}
