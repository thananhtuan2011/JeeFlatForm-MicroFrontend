import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailTaskComponentComponent } from './detail-task-component.component';

describe('DetailTaskComponentComponent', () => {
  let component: DetailTaskComponentComponent;
  let fixture: ComponentFixture<DetailTaskComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailTaskComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailTaskComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
