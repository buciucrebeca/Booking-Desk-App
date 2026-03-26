import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DeskBookingComponent } from '../../../features/desk-booking/desk-booking.component';
import { DeskId } from '../map/map.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-top-bar-booked',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './top-bar-booked.component.html',
  styleUrl: './top-bar-booked.component.scss',
})
export class TopBarBookedComponent {
  @Input() selectedDesk: DeskId | null = null;
  @Output() withdraw = new EventEmitter<void>();

  onWithdrawClick() {
    this.withdraw.emit();
  }
}
