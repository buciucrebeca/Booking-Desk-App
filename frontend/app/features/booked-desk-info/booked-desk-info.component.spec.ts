import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookedDeskInfoComponent } from './booked-desk-info.component';

describe('BookedDeskInfoComponent', () => {
  let component: BookedDeskInfoComponent;
  let fixture: ComponentFixture<BookedDeskInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookedDeskInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookedDeskInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
