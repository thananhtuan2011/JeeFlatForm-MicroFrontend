import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step5ComponentComponent } from './step5-component.component';

describe('Step5ComponentComponent', () => {
  let component: Step5ComponentComponent;
  let fixture: ComponentFixture<Step5ComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Step5ComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Step5ComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
