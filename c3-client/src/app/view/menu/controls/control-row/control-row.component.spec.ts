import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlRowComponent } from './control-row.component';

describe('ControlRowComponent', () => {
  let component: ControlRowComponent;
  let fixture: ComponentFixture<ControlRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
