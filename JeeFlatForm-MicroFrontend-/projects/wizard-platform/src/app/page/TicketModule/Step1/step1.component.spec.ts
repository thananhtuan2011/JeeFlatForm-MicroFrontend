import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step1Component } from './step1.component';

describe('DetailTaskComponentComponent', () => {
  let component: Step1Component;
  let fixture: ComponentFixture<Step1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Step1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Step1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
