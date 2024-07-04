import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPopupWidgetTimeComponent } from './edit-popup-widget-time.component';

describe('EditPopupWidgetTimeComponent', () => {
  let component: EditPopupWidgetTimeComponent;
  let fixture: ComponentFixture<EditPopupWidgetTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPopupWidgetTimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPopupWidgetTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
