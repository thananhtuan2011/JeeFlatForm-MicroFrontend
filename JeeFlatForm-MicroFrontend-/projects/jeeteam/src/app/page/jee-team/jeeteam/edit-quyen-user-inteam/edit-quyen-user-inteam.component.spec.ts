import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditQuyenUserInteamComponent } from './edit-quyen-user-inteam.component';

describe('EditQuyenUserInteamComponent', () => {
  let component: EditQuyenUserInteamComponent;
  let fixture: ComponentFixture<EditQuyenUserInteamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditQuyenUserInteamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditQuyenUserInteamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
