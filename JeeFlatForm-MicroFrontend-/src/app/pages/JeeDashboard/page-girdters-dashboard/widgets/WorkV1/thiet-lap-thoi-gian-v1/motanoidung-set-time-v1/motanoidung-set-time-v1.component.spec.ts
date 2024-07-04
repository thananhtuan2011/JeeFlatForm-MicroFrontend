import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotanoidungSetTimeV1Component } from './motanoidung-set-time-v1.component';

describe('MotanoidungSetTimeV1Component', () => {
  let component: MotanoidungSetTimeV1Component;
  let fixture: ComponentFixture<MotanoidungSetTimeV1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MotanoidungSetTimeV1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MotanoidungSetTimeV1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
