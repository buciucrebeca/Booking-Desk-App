import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [DatePicker, FormsModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
  date: Date | null = null;

  minDate: Date = new Date();
  maxDate: Date = new Date();

  private allowedDates: Date[] = []; // EXACT 3 date permise

  @Output() dateSelected = new EventEmitter<Date | null>();

  constructor() {
    this.setAllowedFrom(new Date()); // start = azi
  }

  onDateChange(d: Date | null) {
    if (!d) {
      this.dateSelected.emit(null);
      return;
    }

    const picked = this.startOfDay(d);

    const ok = this.allowedDates.some((x) => this.isSameDay(x, picked));
    if (!ok) {
      this.date = null; // reset în UI
      this.dateSelected.emit(null);
      return;
    }

    this.dateSelected.emit(picked);
  }

  // ------- helpers -------
  private setAllowedFrom(start: Date) {
    const s = this.startOfDay(start);
    this.allowedDates = this.nextWeekdays(s, 3);

    this.minDate = this.allowedDates[0];
    this.maxDate = this.allowedDates[this.allowedDates.length - 1];
  }

  private nextWeekdays(from: Date, count: number): Date[] {
    const out: Date[] = [];
    let d = new Date(from);

    while (out.length < count) {
      if (this.isWeekday(d)) out.push(this.startOfDay(d));
      d = this.addDays(d, 1);
    }
    return out;
  }

  private isWeekday(d: Date) {
    const day = d.getDay(); // 0=Sun, 6=Sat
    return day !== 0 && day !== 6;
  }

  private startOfDay(d: Date) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  }

  private addDays(d: Date, days: number) {
    const x = new Date(d);
    x.setDate(x.getDate() + days);
    return x;
  }

  private isSameDay(a: Date, b: Date) {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }
}
