import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuanLyCauHoiKhaoSatComponent } from './quan-ly-cau-hoi-khao-sat.component';

describe('QuanLyCauHoiKhaoSatComponent', () => {
  let component: QuanLyCauHoiKhaoSatComponent;
  let fixture: ComponentFixture<QuanLyCauHoiKhaoSatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuanLyCauHoiKhaoSatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuanLyCauHoiKhaoSatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
