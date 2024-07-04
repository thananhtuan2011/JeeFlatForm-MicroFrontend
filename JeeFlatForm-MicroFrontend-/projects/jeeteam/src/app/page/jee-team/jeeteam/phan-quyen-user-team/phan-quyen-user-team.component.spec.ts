import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhanQuyenUserTeamComponent } from './phan-quyen-user-team.component';

describe('PhanQuyenUserTeamComponent', () => {
  let component: PhanQuyenUserTeamComponent;
  let fixture: ComponentFixture<PhanQuyenUserTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhanQuyenUserTeamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhanQuyenUserTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
