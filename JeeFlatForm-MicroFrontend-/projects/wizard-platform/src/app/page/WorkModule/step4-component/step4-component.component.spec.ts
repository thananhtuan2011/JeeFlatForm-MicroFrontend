import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step4ComponentComponent } from './step4-component.component';

describe('Step4ComponentComponent', () => {
  let component: Step4ComponentComponent;
  let fixture: ComponentFixture<Step4ComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Step4ComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Step4ComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
