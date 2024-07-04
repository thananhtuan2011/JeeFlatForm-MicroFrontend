import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailTaskV2ComponentComponent } from './detail-task-v2-component.component';

describe('DetailTaskV2ComponentComponent', () => {
  let component: DetailTaskV2ComponentComponent;
  let fixture: ComponentFixture<DetailTaskV2ComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailTaskV2ComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailTaskV2ComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
