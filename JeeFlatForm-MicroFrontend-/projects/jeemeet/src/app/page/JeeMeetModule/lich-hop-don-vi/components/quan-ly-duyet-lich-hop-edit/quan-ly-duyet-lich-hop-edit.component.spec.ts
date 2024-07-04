import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuanLyDuyetCuocHopEditComponent } from './quan-ly-duyet-lich-hop-edit.component';

describe('QuanLyDuyetCuocHopEditComponent', () => {
  let component: QuanLyDuyetCuocHopEditComponent;
  let fixture: ComponentFixture<QuanLyDuyetCuocHopEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuanLyDuyetCuocHopEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuanLyDuyetCuocHopEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
