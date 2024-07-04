import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChuyenXuLyNhiemVuComponent } from './chuyen-xu-ly-nhiem-vu.component';

describe('ChuyenXuLyNhiemVuComponent', () => {
  let component: ChuyenXuLyNhiemVuComponent;
  let fixture: ComponentFixture<ChuyenXuLyNhiemVuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChuyenXuLyNhiemVuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChuyenXuLyNhiemVuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
