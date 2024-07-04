import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuanLyCauHoiKhaoSatEditComponent } from './quan-ly-cau-hoi-khao-sat-edit.component';

describe('QuanLyCauHoiKhaoSatEditComponent', () => {
  let component: QuanLyCauHoiKhaoSatEditComponent;
  let fixture: ComponentFixture<QuanLyCauHoiKhaoSatEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuanLyCauHoiKhaoSatEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuanLyCauHoiKhaoSatEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
