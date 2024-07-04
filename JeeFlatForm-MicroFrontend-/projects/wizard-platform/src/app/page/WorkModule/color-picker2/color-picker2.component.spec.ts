import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorPicker2Component } from './color-picker2.component';

describe('ColorPicker2Component', () => {
  let component: ColorPicker2Component;
  let fixture: ComponentFixture<ColorPicker2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColorPicker2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorPicker2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
