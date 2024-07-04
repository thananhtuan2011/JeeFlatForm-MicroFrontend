import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NhacNhoNhiemVuComponent } from './nhac-nho-nhiem-vu.component';

describe('NhacNhoNhiemVuComponent', () => {
  let component: NhacNhoNhiemVuComponent;
  let fixture: ComponentFixture<NhacNhoNhiemVuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NhacNhoNhiemVuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NhacNhoNhiemVuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
