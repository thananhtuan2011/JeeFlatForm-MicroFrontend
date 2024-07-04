import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuanLyPhieuLayYKienEditComponent } from './quan-ly-phieu-lay-y-kien-edit.component';

describe('QuanLyPhieuLayYKienEditComponent', () => {
  let component: QuanLyPhieuLayYKienEditComponent;
  let fixture: ComponentFixture<QuanLyPhieuLayYKienEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuanLyPhieuLayYKienEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuanLyPhieuLayYKienEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
