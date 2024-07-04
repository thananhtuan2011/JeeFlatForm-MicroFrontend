import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuanLySoTayCuocHopEditComponent } from './quan-ly-so-tay-cuoc-hop-edit.component';

describe('QuanLyPhongHopEditComponent', () => {
  let component: QuanLySoTayCuocHopEditComponent;
  let fixture: ComponentFixture<QuanLySoTayCuocHopEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuanLySoTayCuocHopEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuanLySoTayCuocHopEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
