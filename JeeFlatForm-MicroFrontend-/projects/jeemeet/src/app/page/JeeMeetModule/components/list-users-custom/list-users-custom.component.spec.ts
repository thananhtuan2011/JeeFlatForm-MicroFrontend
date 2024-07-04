import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListUsersCustomComponent } from './list-users-custom.component';

describe('ListUsersCustomComponent', () => {
  let component: ListUsersCustomComponent;
  let fixture: ComponentFixture<ListUsersCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListUsersCustomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListUsersCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
