import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step1ComponentComponent } from './step1-component.component';

describe('Step1ComponentComponent', () => {
  let component: Step1ComponentComponent;
  let fixture: ComponentFixture<Step1ComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Step1ComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Step1ComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
