import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step3ComponentComponent } from './step3-component.component';

describe('Step3ComponentComponent', () => {
  let component: Step3ComponentComponent;
  let fixture: ComponentFixture<Step3ComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Step3ComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Step3ComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
