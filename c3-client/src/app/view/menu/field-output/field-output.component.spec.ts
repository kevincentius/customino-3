import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldOutputComponent } from './field-output.component';

describe('FieldOutputComponent', () => {
  let component: FieldOutputComponent;
  let fixture: ComponentFixture<FieldOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldOutputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
