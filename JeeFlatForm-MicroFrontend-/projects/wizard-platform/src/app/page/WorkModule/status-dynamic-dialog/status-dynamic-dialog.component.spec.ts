import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusDynamicDialogComponent } from './status-dynamic-dialog.component';

describe('StatusDynamicDialogComponent', () => {
  let component: StatusDynamicDialogComponent;
  let fixture: ComponentFixture<StatusDynamicDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusDynamicDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusDynamicDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
