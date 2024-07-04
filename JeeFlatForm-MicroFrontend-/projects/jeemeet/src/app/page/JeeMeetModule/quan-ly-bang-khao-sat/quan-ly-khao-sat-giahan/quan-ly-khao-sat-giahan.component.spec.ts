import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuanLyGiaHanKhaoSatComponent } from './quan-ly-khao-sat-giahan.component';


describe('QuanLyKhoaHopEditComponent', () => {
  let component: QuanLyGiaHanKhaoSatComponent;
  let fixture: ComponentFixture<QuanLyGiaHanKhaoSatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuanLyGiaHanKhaoSatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuanLyGiaHanKhaoSatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
