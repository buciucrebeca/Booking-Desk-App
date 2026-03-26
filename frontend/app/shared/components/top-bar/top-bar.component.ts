import { Component, EventEmitter, input, Input, Output } from '@angular/core';
import { DeskId } from '../map/map.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss',
})
export class TopBarComponent {
  @Input() selectedDesk: DeskId | null = null;
  @Input() selectedDate: Date | null = null;

  @Output() bookNow = new EventEmitter<void>();

  get canBook(): boolean {
    return !!this.selectedDate && !!this.selectedDesk;
  }

  onBookNowClick() {
    this.bookNow.emit();
  }
}
