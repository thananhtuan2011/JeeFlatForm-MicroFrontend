import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DanhSachCuocHopComponent } from './danh-sach-cuoc-hop.component';

describe('DanhSachCuocHopComponent', () => {
  let component: DanhSachCuocHopComponent;
  let fixture: ComponentFixture<DanhSachCuocHopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DanhSachCuocHopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DanhSachCuocHopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
