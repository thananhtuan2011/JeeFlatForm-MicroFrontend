import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchHandlerComponent } from './switch-handler.component';

describe('SwitchHandlerComponent', () => {
  let component: SwitchHandlerComponent;
  let fixture: ComponentFixture<SwitchHandlerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwitchHandlerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
