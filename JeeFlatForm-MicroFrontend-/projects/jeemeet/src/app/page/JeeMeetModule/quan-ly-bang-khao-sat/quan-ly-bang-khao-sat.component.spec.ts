import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuanLyBangKhaoSatComponent } from './quan-ly-bang-khao-sat.component';

describe('QuanLyBangKhaoSatComponent', () => {
  let component: QuanLyBangKhaoSatComponent;
  let fixture: ComponentFixture<QuanLyBangKhaoSatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuanLyBangKhaoSatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuanLyBangKhaoSatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
