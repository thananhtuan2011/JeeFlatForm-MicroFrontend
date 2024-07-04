import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step2ComponentComponent } from './step2-component.component';

describe('Step2ComponentComponent', () => {
  let component: Step2ComponentComponent;
  let fixture: ComponentFixture<Step2ComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Step2ComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Step2ComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
