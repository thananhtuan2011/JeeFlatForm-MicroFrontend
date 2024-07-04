import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusAttachedComponent } from './status-attached.component';

describe('StatusAttachedComponent', () => {
  let component: StatusAttachedComponent;
  let fixture: ComponentFixture<StatusAttachedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusAttachedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusAttachedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
