import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DeskId } from '../map/map.component';
import { BookingStateService } from '../../services/booking-state.service';

@Component({
  selector: 'app-booked-desk-register',
  standalone: true,
  imports: [TableModule, CommonModule],
  templateUrl: './booked-desk-register.component.html',
  styleUrl: './booked-desk-register.component.scss',
})
export class BookedDeskRegisterComponent {
  constructor(private bookingState: BookingStateService) {}

  rows = [
    { userName: 'User 9', desk: 'A1' },
    { userName: 'User 10', desk: 'A4' },
    { userName: 'User 11', desk: 'B2' },
    { userName: 'User 12', desk: 'B3' },
    { userName: 'User 13', desk: 'C1' },
    { userName: 'User 14', desk: 'C3' },
    { userName: 'User 15', desk: 'D1' },
    { userName: 'User 16', desk: 'D3' },
    { userName: 'User 9', desk: 'A2' },
    { userName: 'User 10', desk: 'A4' },
    { userName: 'User 11', desk: 'B2' },
    { userName: 'User 12', desk: 'B3' },
    { userName: 'User 13', desk: 'C1' },
    { userName: 'User 14', desk: 'C3' },
    { userName: 'User 15', desk: 'D1' },
    { userName: 'User 16', desk: 'D3' },
  ];

  pageSize = 12;
  currentPage = 1;

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.rows.length / this.pageSize));
  }

  get pagedRows() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.rows.slice(start, start + this.pageSize);
  }

  goToPage(page: number) {
    const p = Math.min(Math.max(1, page), this.totalPages);
    this.currentPage = p;
  }

  prevPage() {
    this.goToPage(this.currentPage - 1);
  }

  nextPage() {
    this.goToPage(this.currentPage + 1);
  }
}
