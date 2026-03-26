import { Routes } from '@angular/router';
import { DeskBookingComponent } from './features/desk-booking/desk-booking.component';
import { BookedDeskInfoComponent } from './features/booked-desk-info/booked-desk-info.component';

export const routes: Routes = [
  {
    path: '',
    component: DeskBookingComponent,
    pathMatch: 'full',
  },

  { path: 'booked-desk-info', component: BookedDeskInfoComponent },
];
