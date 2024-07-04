import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuanLySoTayCuocHopListComponent } from './quan-ly-so-tay-cuoc-hop-list.component';

describe('QuanLySoTayCuocHopListComponent', () => {
  let component: QuanLySoTayCuocHopListComponent;
  let fixture: ComponentFixture<QuanLySoTayCuocHopListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuanLySoTayCuocHopListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuanLySoTayCuocHopListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
