import { Component } from '@angular/core';
import {
  DeskId,
  MapComponent,
} from '../../shared/components/map/map.component';
import { TopBarBookedComponent } from '../../shared/components/top-bar-booked/top-bar-booked.component';
import { BookedDeskRegisterComponent } from '../../shared/components/booked-desk-register/booked-desk-register.component';
import { BookingStateService } from '../../shared/services/booking-state.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booked-desk-info',
  standalone: true,
  imports: [
    TopBarBookedComponent,
    MapComponent,
    BookedDeskRegisterComponent,
    CommonModule,
  ],
  templateUrl: './booked-desk-info.component.html',
  styleUrl: './booked-desk-info.component.scss',
})
export class BookedDeskInfoComponent {
  selectedDeskBooked: DeskId | null = null;
  toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(
    private bookingState: BookingStateService,
    private router: Router
  ) {}

  private showToast(msg: string, type: 'success' | 'error' = 'success') {
    this.toastMessage = msg;
    this.toastType = type;
    this.toastVisible = true;

    setTimeout(() => {
      this.toastVisible = false;
    }, 3000);
  }

  ngOnInit(): void {
    this.selectedDeskBooked = this.bookingState.getBookedDeskSnapshot();
    this.bookingState.bookedDesk$.subscribe(
      (d) => (this.selectedDeskBooked = d)
    );
  }

  onWithdrawBoking() {
    const deskId = this.selectedDeskBooked ?? 'Unknown';
    this.bookingState.clearBooking();
    this.showToast(`Desk ${deskId} was withdrawn successfully.`, 'success');

    setTimeout(() => {
      this.router.navigate(['/desk-booking']);
    }, 800);
  }
}
