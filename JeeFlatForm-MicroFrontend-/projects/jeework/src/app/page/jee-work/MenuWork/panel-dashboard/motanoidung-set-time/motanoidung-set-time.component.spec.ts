import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotanoidungSetTimeComponent } from './motanoidung-set-time.component';

describe('MotanoidungSetTimeComponent', () => {
  let component: MotanoidungSetTimeComponent;
  let fixture: ComponentFixture<MotanoidungSetTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MotanoidungSetTimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MotanoidungSetTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
