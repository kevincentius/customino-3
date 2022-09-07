import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomAutoStartCountdownComponent } from './room-auto-start-countdown.component';

describe('RoomAutoStartCountdownComponent', () => {
  let component: RoomAutoStartCountdownComponent;
  let fixture: ComponentFixture<RoomAutoStartCountdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomAutoStartCountdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomAutoStartCountdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
