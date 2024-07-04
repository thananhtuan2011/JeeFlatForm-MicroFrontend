import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseUsersV3Component } from './choose-user-v3.component';
describe('ChooseUsersV3Component', () => {
  let component: ChooseUsersV3Component;
  let fixture: ComponentFixture<ChooseUsersV3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChooseUsersV3Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseUsersV3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
