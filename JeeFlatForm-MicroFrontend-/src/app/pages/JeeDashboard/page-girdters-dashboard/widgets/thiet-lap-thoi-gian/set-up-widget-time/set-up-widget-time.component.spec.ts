import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetUpWidgetTimeComponent } from './set-up-widget-time.component';

describe('SetUpWidgetTimeComponent', () => {
  let component: SetUpWidgetTimeComponent;
  let fixture: ComponentFixture<SetUpWidgetTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetUpWidgetTimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetUpWidgetTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
