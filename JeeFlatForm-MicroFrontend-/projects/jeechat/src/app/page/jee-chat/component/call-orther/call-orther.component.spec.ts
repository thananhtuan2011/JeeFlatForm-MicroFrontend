import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallOrtherComponent } from './call-orther.component';

describe('CallOrtherComponent', () => {
  let component: CallOrtherComponent;
  let fixture: ComponentFixture<CallOrtherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallOrtherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CallOrtherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
