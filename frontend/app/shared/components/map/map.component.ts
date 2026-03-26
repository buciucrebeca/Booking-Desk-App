import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { BookingStateService } from '../../services/booking-state.service';

export type DeskId =
  | 'A1'
  | 'A2'
  | 'A3'
  | 'A4'
  | 'B1'
  | 'B2'
  | 'B3'
  | 'B4'
  | 'C1'
  | 'C2'
  | 'C3'
  | 'C4'
  | 'D1'
  | 'D2'
  | 'D3'
  | 'D4';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent {
  @Input() selectedDesk: DeskId | null = null;
  @Input() selectable: boolean = true;
  @Output() deskSelected = new EventEmitter<DeskId | null>();

  private sub?: Subscription;

  constructor(private bookingState: BookingStateService) {}

  selectDesk(id: DeskId) {
    if (!this.selectable) return;
    this.selectedDesk = this.selectedDesk === id ? null : id;
    this.deskSelected.emit(this.selectedDesk);
  }

  isSelected(id: DeskId) {
    return this.selectedDesk === id;
  }
}
