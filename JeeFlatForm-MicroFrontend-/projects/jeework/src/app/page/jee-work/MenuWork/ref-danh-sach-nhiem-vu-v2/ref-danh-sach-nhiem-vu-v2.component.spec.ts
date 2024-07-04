import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RefDanhSachNhiemVuVer2Component } from './ref-danh-sach-nhiem-vu-v2.component';


describe('RefDanhSachNhiemVuVer2Component', () => {
  let component: RefDanhSachNhiemVuVer2Component;
  let fixture: ComponentFixture<RefDanhSachNhiemVuVer2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefDanhSachNhiemVuVer2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RefDanhSachNhiemVuVer2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
