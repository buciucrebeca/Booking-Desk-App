import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookedDeskRegisterComponent } from './booked-desk-register.component';

describe('BookedDeskRegisterComponent', () => {
  let component: BookedDeskRegisterComponent;
  let fixture: ComponentFixture<BookedDeskRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookedDeskRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookedDeskRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
