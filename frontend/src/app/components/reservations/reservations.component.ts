import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReservationService } from '../../services/reservation.service';
import { AuthService } from '../../services/auth.service';
import { ReservationResponse, ReservationStatus } from '../../models/reservation.model';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatCardModule, MatTableModule, MatButtonModule, MatChipsModule, MatSnackBarModule, MatIconModule, MatSelectModule, MatFormFieldModule, MatTooltipModule],
  styles: [`
    .reservations-page {
      background: #F5F0E8;
      min-height: calc(100vh - 64px);
      padding: 32px 24px;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
    }
    .page-header h1 {
      margin: 0;
      font-size: 26px;
      font-family: 'Playfair Display', Georgia, serif;
      font-weight: 700;
      color: #2D5016;
    }
    .header-actions {
      display: flex;
      gap: 12px;
      align-items: center;
      flex-wrap: wrap;
    }
    .table-card {
      border-radius: 12px !important;
      overflow: hidden;
    }
    table { width: 100%; }
    tr.mat-mdc-row:hover { background: #f9f9ff; }
    th.mat-header-cell {
      font-weight: 600 !important;
      color: #555 !important;
      font-size: 12px !important;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }
    td.mat-cell { font-size: 14px; }
    .status-pill {
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      color: white;
      white-space: nowrap;
    }
    .payment-pill {
      padding: 3px 8px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 500;
      background: #f0f0f0;
      color: #555;
    }
    .empty-state {
      text-align: center;
      padding: 60px 24px;
      color: #999;
    }
    .empty-state mat-icon {
      font-size: 56px;
      width: 56px;
      height: 56px;
      opacity: 0.3;
    }
  `],
  template: `
    <div class="reservations-page">
      <div style="max-width:1300px;margin:0 auto">
        <div class="page-header">
          <h1>{{ isStaff ? 'All Reservations' : 'My Reservations' }}</h1>
          <div class="header-actions">
            @if (isStaff) {
              <mat-form-field appearance="outline" style="width:170px;margin:0">
                <mat-label>Filter by Status</mat-label>
                <mat-select [(value)]="statusFilter" (selectionChange)="filterReservations()">
                  <mat-option value="ALL">All</mat-option>
                  <mat-option value="PENDING">Pending</mat-option>
                  <mat-option value="CONFIRMED">Confirmed</mat-option>
                  <mat-option value="CHECKED_IN">Checked In</mat-option>
                  <mat-option value="CHECKED_OUT">Checked Out</mat-option>
                  <mat-option value="CANCELLED">Cancelled</mat-option>
                  <mat-option value="REJECTED">Rejected</mat-option>
                </mat-select>
              </mat-form-field>
              <a mat-raised-button routerLink="/reservations/new" style="background:#2D5016;color:white;border-radius:100px">
                <mat-icon>person_add</mat-icon> Assign Reservation
              </a>
            }
            @if (!isStaff) {
              <a mat-raised-button routerLink="/reservations/new" style="background:#2D5016;color:white;border-radius:100px">
                <mat-icon>add</mat-icon> New Reservation
              </a>
            }
          </div>
        </div>

        <mat-card class="table-card">
          @if (filteredReservations.length > 0) {
            <table mat-table [dataSource]="filteredReservations">
              <ng-container matColumnDef="reservationNumber">
                <th mat-header-cell *matHeaderCellDef>Reservation #</th>
                <td mat-cell *matCellDef="let r"><strong>{{ r.reservationNumber }}</strong></td>
              </ng-container>
              <ng-container matColumnDef="roomNumber">
                <th mat-header-cell *matHeaderCellDef>Room</th>
                <td mat-cell *matCellDef="let r">{{ r.roomNumber }}</td>
              </ng-container>
              @if (isStaff) {
                <ng-container matColumnDef="userName">
                  <th mat-header-cell *matHeaderCellDef>Guest</th>
                  <td mat-cell *matCellDef="let r">{{ r.userName }}</td>
                </ng-container>
              }
              <ng-container matColumnDef="checkIn">
                <th mat-header-cell *matHeaderCellDef>Check-in</th>
                <td mat-cell *matCellDef="let r">{{ r.checkInDate }}</td>
              </ng-container>
              <ng-container matColumnDef="checkOut">
                <th mat-header-cell *matHeaderCellDef>Check-out</th>
                <td mat-cell *matCellDef="let r">{{ r.checkOutDate }}</td>
              </ng-container>
              <ng-container matColumnDef="totalAmount">
                <th mat-header-cell *matHeaderCellDef>Total</th>
                <td mat-cell *matCellDef="let r"><strong>\${{ r.totalAmount }}</strong></td>
              </ng-container>
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let r">
                  <span class="status-pill" [style.background]="getStatusColor(r.status)">{{ r.status }}</span>
                </td>
              </ng-container>
              <ng-container matColumnDef="paymentStatus">
                <th mat-header-cell *matHeaderCellDef>Payment</th>
                <td mat-cell *matCellDef="let r">
                  <span class="payment-pill">{{ r.paymentStatus }}</span>
                </td>
              </ng-container>
              <ng-container matColumnDef="specialRequests">
                <th mat-header-cell *matHeaderCellDef>Requests</th>
                <td mat-cell *matCellDef="let r">
                  @if (r.specialRequests) {
                    <mat-icon [matTooltip]="r.specialRequests" style="color:#1976d2;cursor:help;font-size:18px">info</mat-icon>
                  }
                </td>
              </ng-container>
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let r" style="white-space:nowrap">
                  @if (isStaff && r.status === 'PENDING') {
                    <button mat-stroked-button color="primary" (click)="approve(r.id, 'CONFIRMED')" style="margin-right:4px">Approve</button>
                    <button mat-stroked-button color="warn" (click)="approve(r.id, 'REJECTED')">Reject</button>
                  }
                  @if (isStaff && r.status === 'CONFIRMED') {
                    <button mat-stroked-button color="primary" (click)="approve(r.id, 'CHECKED_IN')">Check In</button>
                  }
                  @if (isStaff && r.status === 'CHECKED_IN') {
                    <button mat-stroked-button (click)="approve(r.id, 'CHECKED_OUT')">Check Out</button>
                  }
                  @if (!isStaff && r.status === 'PENDING') {
                    <button mat-stroked-button color="warn" (click)="cancel(r.id)">Cancel</button>
                  }
                  <a mat-icon-button [routerLink]="['/payments', r.id]" matTooltip="View Payments">
                    <mat-icon>payment</mat-icon>
                  </a>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
            </table>
          } @else {
            <div class="empty-state">
              <mat-icon>assignment</mat-icon>
              <p>No reservations found.</p>
            </div>
          }
        </mat-card>
      </div>
    </div>
  `
})
export class ReservationsComponent implements OnInit {
  reservations: ReservationResponse[] = [];
  filteredReservations: ReservationResponse[] = [];
  isStaff = false;
  displayedColumns: string[] = [];
  statusFilter = 'ALL';

  constructor(
    private reservationService: ReservationService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.isStaff = this.authService.isStaff();
    this.displayedColumns = this.isStaff
      ? ['reservationNumber', 'roomNumber', 'userName', 'checkIn', 'checkOut', 'totalAmount', 'status', 'paymentStatus', 'specialRequests', 'actions']
      : ['reservationNumber', 'roomNumber', 'checkIn', 'checkOut', 'totalAmount', 'status', 'paymentStatus', 'actions'];
    this.loadReservations();
  }

  loadReservations() {
    const obs = this.isStaff
      ? this.reservationService.getAllReservations(0, 50)
      : this.reservationService.getMyReservations();
    obs.subscribe({
      next: (data: any) => {
        this.reservations = data.content ? data.content : data;
        this.filterReservations();
      },
      error: () => this.snackBar.open('Failed to load reservations', 'Close', { duration: 3000 })
    });
  }

  filterReservations() {
    if (this.statusFilter === 'ALL') {
      this.filteredReservations = this.reservations;
    } else {
      this.filteredReservations = this.reservations.filter(r => r.status === this.statusFilter);
    }
  }

  approve(id: number, status: ReservationStatus) {
    this.reservationService.approveReservation(id, { status }).subscribe({
      next: () => {
        this.snackBar.open(`Reservation ${status.toLowerCase().replace('_', ' ')}!`, 'Close', { duration: 3000 });
        this.loadReservations();
      },
      error: (err) => this.snackBar.open(err.error?.message || 'Failed', 'Close', { duration: 3000 })
    });
  }

  cancel(id: number) {
    this.reservationService.cancelReservation(id).subscribe({
      next: () => {
        this.snackBar.open('Reservation cancelled', 'Close', { duration: 3000 });
        this.loadReservations();
      },
      error: (err) => this.snackBar.open(err.error?.message || 'Failed', 'Close', { duration: 3000 })
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
