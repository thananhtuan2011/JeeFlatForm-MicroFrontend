import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditPopupWidgetTimeV1Component } from './edit-popup-widget-time-v1.component';


describe('EditPopupWidgetTimeV1Component', () => {
  let component: EditPopupWidgetTimeV1Component;
  let fixture: ComponentFixture<EditPopupWidgetTimeV1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPopupWidgetTimeV1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPopupWidgetTimeV1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
