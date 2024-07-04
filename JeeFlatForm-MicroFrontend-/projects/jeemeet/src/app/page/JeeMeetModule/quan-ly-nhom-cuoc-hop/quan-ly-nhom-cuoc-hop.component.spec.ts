import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuanLySoTayCuocHopComponent } from './quan-ly-so-tay-cuoc-hop.component';

describe('QuanLyPhongHopComponent', () => {
  let component: QuanLySoTayCuocHopComponent;
  let fixture: ComponentFixture<QuanLySoTayCuocHopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuanLySoTayCuocHopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuanLySoTayCuocHopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
