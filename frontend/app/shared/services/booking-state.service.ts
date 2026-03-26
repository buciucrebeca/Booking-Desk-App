import { Injectable } from '@angular/core';
import { DeskId } from '../components/map/map.component';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BookingStateService {
  private bookedDeskSubject = new BehaviorSubject<DeskId | null>(null);
  bookedDesk$ = this.bookedDeskSubject.asObservable();

  setBookedDesk(desk: DeskId) {
    this.bookedDeskSubject.next(desk);
  }

  getBookedDeskSnapshot(): DeskId | null {
    return this.bookedDeskSubject.value;
  }

  clearBooking() {
    this.bookedDeskSubject.next(null);
  }
}
