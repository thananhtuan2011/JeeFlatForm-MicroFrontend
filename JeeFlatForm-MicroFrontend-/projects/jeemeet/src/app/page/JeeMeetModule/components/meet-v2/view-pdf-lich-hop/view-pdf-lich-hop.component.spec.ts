import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPdfLichHopComponent } from './view-pdf-lich-hop.component';

describe('ViewPdfLichHopComponent', () => {
  let component: ViewPdfLichHopComponent;
  let fixture: ComponentFixture<ViewPdfLichHopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPdfLichHopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPdfLichHopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
