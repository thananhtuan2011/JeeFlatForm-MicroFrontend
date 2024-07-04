import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DanhSachNhiemVuVer2Component } from './danh-sach-nhiem-vu-v2.component';

describe('DanhSachNhiemVuVer2Component', () => {
  let component: DanhSachNhiemVuVer2Component;
  let fixture: ComponentFixture<DanhSachNhiemVuVer2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DanhSachNhiemVuVer2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DanhSachNhiemVuVer2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
