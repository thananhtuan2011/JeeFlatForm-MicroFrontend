import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuanLyNhomCuocHopEditComponent } from './quan-ly-nhom-cuoc-hop-edit.component';

describe('QuanLyPhongHopEditComponent', () => {
  let component: QuanLyNhomCuocHopEditComponent;
  let fixture: ComponentFixture<QuanLyNhomCuocHopEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuanLyNhomCuocHopEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuanLyNhomCuocHopEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
