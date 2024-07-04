import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuocHopInfoComponent } from './cuoc-hop-info.component';

describe('CuocHopInfoComponent', () => {
  let component: CuocHopInfoComponent;
  let fixture: ComponentFixture<CuocHopInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuocHopInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuocHopInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
