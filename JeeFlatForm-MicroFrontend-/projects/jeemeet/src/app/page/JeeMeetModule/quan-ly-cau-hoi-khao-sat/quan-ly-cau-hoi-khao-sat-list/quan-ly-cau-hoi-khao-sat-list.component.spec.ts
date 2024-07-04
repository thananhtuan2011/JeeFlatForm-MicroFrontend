import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuanLyCauHoiKhaoSatListComponent } from './quan-ly-cau-hoi-khao-sat-list.component';

describe('QuanLyCauHoiKhaoSatListComponent', () => {
  let component: QuanLyCauHoiKhaoSatListComponent;
  let fixture: ComponentFixture<QuanLyCauHoiKhaoSatListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuanLyCauHoiKhaoSatListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuanLyCauHoiKhaoSatListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
