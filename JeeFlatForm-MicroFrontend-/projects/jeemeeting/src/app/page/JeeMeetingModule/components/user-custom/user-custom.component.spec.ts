import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCustomComponent } from './user-custom.component';

describe('UserCustomComponent', () => {
  let component: UserCustomComponent;
  let fixture: ComponentFixture<UserCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserCustomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
