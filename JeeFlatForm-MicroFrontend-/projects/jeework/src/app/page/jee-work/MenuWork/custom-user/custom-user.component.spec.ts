import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomUserComponent } from './custom-user.component';

describe('CustomUserComponent', () => {
  let component: CustomUserComponent;
  let fixture: ComponentFixture<CustomUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
