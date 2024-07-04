import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppFocusBlockComponent } from './app-focus-block.component';

describe('AppFocusBlockComponent', () => {
  let component: AppFocusBlockComponent;
  let fixture: ComponentFixture<AppFocusBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppFocusBlockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppFocusBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
