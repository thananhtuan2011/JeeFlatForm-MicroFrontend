import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseUsersV2Component } from './choose-user-v2.component';
describe('ChooseUsersV2Component', () => {
  let component: ChooseUsersV2Component;
  let fixture: ComponentFixture<ChooseUsersV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChooseUsersV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseUsersV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
