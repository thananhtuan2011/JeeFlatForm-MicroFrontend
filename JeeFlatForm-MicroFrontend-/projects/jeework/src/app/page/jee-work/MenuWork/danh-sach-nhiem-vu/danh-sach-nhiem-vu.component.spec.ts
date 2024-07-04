import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DanhSachNhiemVuComponent } from './danh-sach-nhiem-vu.component';

describe('DanhSachNhiemVuComponent', () => {
  let component: DanhSachNhiemVuComponent;
  let fixture: ComponentFixture<DanhSachNhiemVuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DanhSachNhiemVuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DanhSachNhiemVuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
