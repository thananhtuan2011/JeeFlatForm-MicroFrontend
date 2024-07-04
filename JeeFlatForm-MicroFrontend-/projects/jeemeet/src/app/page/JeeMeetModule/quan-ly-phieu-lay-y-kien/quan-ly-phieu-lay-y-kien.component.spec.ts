import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuanLyPhieuLayYKienComponent } from './quan-ly-phieu-lay-y-kien.component';

describe('QuanLyPPhieuLayYKienComponent', () => {
  let component: QuanLyPhieuLayYKienComponent;
  let fixture: ComponentFixture<QuanLyPhieuLayYKienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuanLyPhieuLayYKienComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuanLyPhieuLayYKienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
