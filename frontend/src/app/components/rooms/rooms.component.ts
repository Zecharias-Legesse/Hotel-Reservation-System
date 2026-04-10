import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { RoomService } from '../../services/room.service';
import { AuthService } from '../../services/auth.service';
import { RoomResponse } from '../../models/room.model';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatChipsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatSnackBarModule, MatMenuModule, MatSelectModule, MatExpansionModule],
  styles: [`
    .rooms-page {
      background: #F5F0E8;
      min-height: calc(100vh - 64px);
      padding: 32px 24px;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .page-header h1 {
      margin: 0;
      font-size: 26px;
      font-family: 'Playfair Display', Georgia, serif;
      font-weight: 700;
      color: #2D5016;
    }
    .search-bar { margin-bottom: 16px; }
    .filters-panel {
      border-radius: 12px !important;
      margin-bottom: 24px;
    }
    .availability-card {
      border-radius: 12px !important;
      margin-bottom: 24px;
      padding: 20px;
    }
    .results-count {
      color: #888;
      font-size: 13px;
      margin-bottom: 16px;
    }
    .rooms-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
      gap: 20px;
    }
    .room-card {
      border-radius: 12px !important;
      overflow: hidden;
    }
    .room-card-header {
      background: linear-gradient(135deg, #2D5016, #4A7A25);
      color: white;
      padding: 20px;
    }
    .room-number {
      font-size: 22px;
      font-weight: 700;
      margin: 0 0 4px;
    }
    .room-type-floor {
      font-size: 13px;
      opacity: 0.85;
      margin: 0;
    }
    .room-body {
      padding: 16px 20px;
    }
    .room-price {
      font-size: 22px;
      font-weight: 700;
      color: #C9931A;
      margin: 0 0 8px;
    }
    .room-price span {
      font-size: 13px;
      font-weight: 400;
      color: #888;
    }
    .room-detail {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: #555;
      margin-bottom: 4px;
    }
    .room-detail mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #999;
    }
    .status-pill {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      color: white;
      margin-top: 8px;
    }
    .room-actions {
      padding: 8px 12px 12px !important;
      border-top: 1px solid #f0f0f0;
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
      margin-bottom: 12px;
    }
  `],
  template: `
    <div class="rooms-page">
      <div style="max-width:1200px;margin:0 auto">
        <div class="page-header">
          <h1>Rooms</h1>
          @if (auth.isStaff()) {
            <button mat-raised-button color="primary" routerLink="/rooms/new">
              <mat-icon>add</mat-icon> Add Room
            </button>
          }
        </div>

        <mat-form-field appearance="outline" class="search-bar" style="width:100%">
          <mat-label>Search by room number</mat-label>
          <input matInput [(ngModel)]="searchQuery" (ngModelChange)="applyFilters()" placeholder="e.g. 101, 302...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <mat-expansion-panel class="filters-panel">
          <mat-expansion-panel-header>
            <mat-panel-title><mat-icon style="margin-right:8px">filter_list</mat-icon>Filters</mat-panel-title>
            <mat-panel-description>Type, floor, capacity, price, status</mat-panel-description>
          </mat-expansion-panel-header>
          <div style="display:flex;gap:16px;flex-wrap:wrap;padding:8px 0">
            <mat-form-field appearance="outline" style="width:150px">
              <mat-label>Room Type</mat-label>
              <mat-select [(value)]="filterType" (selectionChange)="applyFilters()">
                <mat-option value="ALL">All Types</mat-option>
                <mat-option value="SINGLE">Single</mat-option>
                <mat-option value="DOUBLE">Double</mat-option>
                <mat-option value="DELUXE">Deluxe</mat-option>
                <mat-option value="SUITE">Suite</mat-option>
                <mat-option value="PRESIDENTIAL">Presidential</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline" style="width:130px">
              <mat-label>Floor</mat-label>
              <mat-select [(value)]="filterFloor" (selectionChange)="applyFilters()">
                <mat-option value="ALL">All Floors</mat-option>
                @for (f of availableFloors; track f) {
                  <mat-option [value]="f">Floor {{ f }}</mat-option>
                }
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline" style="width:130px">
              <mat-label>Min Capacity</mat-label>
              <mat-select [(value)]="filterCapacity" (selectionChange)="applyFilters()">
                <mat-option value="0">Any</mat-option>
                <mat-option value="1">1+</mat-option>
                <mat-option value="2">2+</mat-option>
                <mat-option value="3">3+</mat-option>
                <mat-option value="4">4+</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline" style="width:140px">
              <mat-label>Max Price</mat-label>
              <mat-select [(value)]="filterMaxPrice" (selectionChange)="applyFilters()">
                <mat-option value="0">Any</mat-option>
                <mat-option value="100">Under \$100</mat-option>
                <mat-option value="150">Under \$150</mat-option>
                <mat-option value="250">Under \$250</mat-option>
                <mat-option value="400">Under \$400</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline" style="width:140px">
              <mat-label>Status</mat-label>
              <mat-select [(value)]="filterStatus" (selectionChange)="applyFilters()">
                <mat-option value="ALL">All</mat-option>
                <mat-option value="AVAILABLE">Available</mat-option>
                <mat-option value="OCCUPIED">Occupied</mat-option>
                <mat-option value="MAINTENANCE">Maintenance</mat-option>
                <mat-option value="CLEANING">Cleaning</mat-option>
              </mat-select>
            </mat-form-field>
            <button mat-stroked-button (click)="clearFilters()" style="align-self:center">
              <mat-icon>clear</mat-icon> Clear
            </button>
          </div>
        </mat-expansion-panel>

        <mat-card class="availability-card">
          <form [formGroup]="searchForm" (ngSubmit)="searchAvailable()" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
            <mat-icon style="color:#1976d2">date_range</mat-icon>
            <strong style="font-size:14px">Check Availability:</strong>
            <mat-form-field appearance="outline" style="flex:1;min-width:150px">
              <mat-label>Check-in</mat-label>
              <input matInput type="date" formControlName="checkIn">
            </mat-form-field>
            <mat-form-field appearance="outline" style="flex:1;min-width:150px">
              <mat-label>Check-out</mat-label>
              <input matInput type="date" formControlName="checkOut">
            </mat-form-field>
            <button mat-raised-button color="primary" type="submit">Search</button>
            <button mat-button type="button" (click)="loadAllRooms()">Show All</button>
          </form>
        </mat-card>

        <p class="results-count">Showing <strong>{{ filteredRooms.length }}</strong> of <strong>{{ allRooms.length }}</strong> rooms</p>

        <div class="rooms-grid">
          @for (room of filteredRooms; track room.id) {
            <mat-card class="room-card">
              <div class="room-card-header">
                <div class="room-number">Room {{ room.roomNumber }}</div>
                <div class="room-type-floor">{{ room.roomType }} &bull; Floor {{ room.floor }}</div>
              </div>
              <div class="room-body">
                <div class="room-price">\${{ room.pricePerNight }}<span> / night</span></div>
                <div class="room-detail">
                  <mat-icon>people</mat-icon>
                  {{ room.capacity }} guest{{ room.capacity > 1 ? 's' : '' }}
                </div>
                @if (room.description) {
                  <div class="room-detail">
                    <mat-icon>info</mat-icon>
                    {{ room.description }}
                  </div>
                }
                <span class="status-pill" [style.background]="getStatusColor(room.status)">{{ room.status }}</span>
              </div>
              <mat-card-actions class="room-actions">
                @if (room.status === 'AVAILABLE' && auth.isLoggedIn() && !auth.isStaff()) {
                  <button mat-raised-button [routerLink]="['/reservations/new']" [queryParams]="{roomId: room.id}" style="width:100%;background:#2D5016;color:white;border-radius:100px;font-weight:600">
                    Book Now
                  </button>
                }
                @if (auth.isStaff()) {
                  <button mat-button [routerLink]="['/rooms/edit', room.id]">
                    <mat-icon>edit</mat-icon> Edit
                  </button>
                  <button mat-button [matMenuTriggerFor]="statusMenu">
                    <mat-icon>swap_horiz</mat-icon> Status
                  </button>
                  <mat-menu #statusMenu="matMenu">
                    <button mat-menu-item (click)="changeStatus(room.id, 'AVAILABLE')">
                      <mat-icon style="color:#4caf50">check_circle</mat-icon> Available
                    </button>
                    <button mat-menu-item (click)="changeStatus(room.id, 'MAINTENANCE')">
                      <mat-icon style="color:#ff9800">build</mat-icon> Maintenance
                    </button>
                    <button mat-menu-item (click)="changeStatus(room.id, 'CLEANING')">
                      <mat-icon style="color:#2196f3">cleaning_services</mat-icon> Cleaning
                    </button>
                  </mat-menu>
                  <button mat-icon-button color="warn" (click)="deleteRoom(room.id)" style="float:right">
                    <mat-icon>delete</mat-icon>
                  </button>
                }
              </mat-card-actions>
            </mat-card>
          }
        </div>

        @if (filteredRooms.length === 0) {
          <div class="empty-state">
            <mat-icon>meeting_room</mat-icon>
            <p>No rooms found matching your criteria.</p>
            <button mat-stroked-button (click)="clearFilters()">Clear Filters</button>
          </div>
        }
      </div>
    </div>
  `
})
export class RoomsComponent implements OnInit {
  allRooms: RoomResponse[] = [];
  filteredRooms: RoomResponse[] = [];
  searchForm: FormGroup;

  searchQuery = '';
  filterType = 'ALL';
  filterFloor: string = 'ALL';
  filterCapacity = '0';
  filterMaxPrice = '0';
  filterStatus = 'ALL';
  availableFloors: number[] = [];

  constructor(
    private roomService: RoomService,
    public auth: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.searchForm = this.fb.group({ checkIn: [''], checkOut: [''] });
  }

  ngOnInit() {
    this.loadAllRooms();
  }

  loadAllRooms() {
    this.roomService.getAllRooms(0, 200).subscribe({
      next: (page) => {
        this.allRooms = page.content;
        this.availableFloors = [...new Set(this.allRooms.map(r => r.floor))].sort();
        this.applyFilters();
      },
      error: () => this.snackBar.open('Failed to load rooms', 'Close', { duration: 3000 })
    });
  }

  applyFilters() {
    let rooms = this.allRooms;

    if (this.searchQuery.trim()) {
      rooms = rooms.filter(r => r.roomNumber.includes(this.searchQuery.trim()));
    }
    if (this.filterType !== 'ALL') {
      rooms = rooms.filter(r => r.roomType === this.filterType);
    }
    if (this.filterFloor !== 'ALL') {
      rooms = rooms.filter(r => r.floor === +this.filterFloor);
    }
    if (+this.filterCapacity > 0) {
      rooms = rooms.filter(r => r.capacity >= +this.filterCapacity);
    }
    if (+this.filterMaxPrice > 0) {
      rooms = rooms.filter(r => r.pricePerNight <= +this.filterMaxPrice);
    }
    if (this.filterStatus !== 'ALL') {
      rooms = rooms.filter(r => r.status === this.filterStatus);
    }

    this.filteredRooms = rooms;
  }

  clearFilters() {
    this.searchQuery = '';
    this.filterType = 'ALL';
    this.filterFloor = 'ALL';
    this.filterCapacity = '0';
    this.filterMaxPrice = '0';
    this.filterStatus = 'ALL';
    this.applyFilters();
  }

  searchAvailable() {
    const { checkIn, checkOut } = this.searchForm.value;
    if (!checkIn || !checkOut) {
      this.snackBar.open('Please select both dates', 'Close', { duration: 3000 });
      return;
    }
    this.roomService.getAvailableRooms(checkIn, checkOut).subscribe({
      next: (rooms) => {
        this.allRooms = rooms;
        this.applyFilters();
      },
      error: () => this.snackBar.open('Search failed', 'Close', { duration: 3000 })
    });
  }

  changeStatus(roomId: number, status: string) {
    this.roomService.updateRoomStatus(roomId, status).subscribe({
      next: () => {
        this.snackBar.open(`Room status updated to ${status}`, 'Close', { duration: 3000 });
        this.loadAllRooms();
      },
      error: () => this.snackBar.open('Failed to update status', 'Close', { duration: 3000 })
    });
  }

  deleteRoom(roomId: number) {
    if (confirm('Are you sure you want to delete this room?')) {
      this.roomService.deleteRoom(roomId).subscribe({
        next: () => {
          this.snackBar.open('Room deleted', 'Close', { duration: 3000 });
          this.loadAllRooms();
        },
        error: () => this.snackBar.open('Failed to delete room', 'Close', { duration: 3000 })
      });
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'AVAILABLE': return '#4caf50';
      case 'OCCUPIED': return '#f44336';
      case 'MAINTENANCE': return '#ff9800';
      case 'CLEANING': return '#2196f3';
      default: return '#9e9e9e';
    }
  }
}
