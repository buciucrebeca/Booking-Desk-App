import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopBarBookedComponent } from './top-bar-booked.component';

describe('TopBarBookedComponent', () => {
  let component: TopBarBookedComponent;
  let fixture: ComponentFixture<TopBarBookedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopBarBookedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopBarBookedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
