import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuanLyPhieuLayYKienListComponent } from './quan-ly-phieu-lay-y-kien-list.component';

describe('QuanLyPhongHopListComponent', () => {
  let component: QuanLyPhieuLayYKienListComponent;
  let fixture: ComponentFixture<QuanLyPhieuLayYKienListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuanLyPhieuLayYKienListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuanLyPhieuLayYKienListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
