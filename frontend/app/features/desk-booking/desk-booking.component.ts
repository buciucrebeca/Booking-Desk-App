import { Component } from '@angular/core';
import { TopBarComponent } from '../../shared/components/top-bar/top-bar.component';
import { CalendarComponent } from '../../shared/components/calendar/calendar.component';
import { MapComponent } from '../../shared/components/map/map.component';
import { DeskId } from '../../shared/components/map/map.component';
import { CommonModule } from '@angular/common';
import { BookingStateService } from '../../shared/services/booking-state.service';

@Component({
  selector: 'app-desk-booking',
  standalone: true,
  imports: [TopBarComponent, CalendarComponent, MapComponent, CommonModule],
  templateUrl: './desk-booking.component.html',
  styleUrl: './desk-booking.component.scss',
})
export class DeskBookingComponent {
  selectedDesk: DeskId | null = null;
  selectedDate: Date | null = null;
  showPopup = false;
  popupMessage = '';
  private popupTimerId: number | null = null;

  constructor(private bookingState: BookingStateService) {}

  onDateSelected(d: Date | null) {
    this.selectedDate = d;
    this.selectedDesk = null;
  }

  onDeskSelected(desk: DeskId | null) {
    this.selectedDesk = desk;
  }

  onBookNow() {
    if (!this.selectedDate || !this.selectedDesk) return;
    this.bookingState.setBookedDesk(this.selectedDesk);

    this.popupMessage = `Desk ${this.selectedDesk} has been booked successfully.`;
    this.showPopup = true;

    if (this.popupTimerId) window.clearTimeout(this.popupTimerId);

    this.popupTimerId = window.setTimeout(() => {
      this.showPopup = false;
      this.popupTimerId = null;
    }, 3000);
  }

  closePopup() {
    this.showPopup = false;
  }
}
