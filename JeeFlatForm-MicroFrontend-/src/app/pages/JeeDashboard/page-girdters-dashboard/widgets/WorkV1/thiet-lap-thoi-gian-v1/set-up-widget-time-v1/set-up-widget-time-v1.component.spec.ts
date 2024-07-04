import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SetUpWidgetTimeV1Component } from './set-up-widget-time-v1.component';


describe('SetUpWidgetTimeV1Component', () => {
  let component: SetUpWidgetTimeV1Component;
  let fixture: ComponentFixture<SetUpWidgetTimeV1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetUpWidgetTimeV1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetUpWidgetTimeV1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
