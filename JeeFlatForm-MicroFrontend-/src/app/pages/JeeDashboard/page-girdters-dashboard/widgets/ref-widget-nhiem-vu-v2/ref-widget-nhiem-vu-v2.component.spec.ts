import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RefWidgetNhiemVuVer2Component } from './ref-widget-nhiem-vu-v2.component';


describe('RefWidgetNhiemVuVer2Component', () => {
  let component: RefWidgetNhiemVuVer2Component;
  let fixture: ComponentFixture<RefWidgetNhiemVuVer2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefWidgetNhiemVuVer2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RefWidgetNhiemVuVer2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
