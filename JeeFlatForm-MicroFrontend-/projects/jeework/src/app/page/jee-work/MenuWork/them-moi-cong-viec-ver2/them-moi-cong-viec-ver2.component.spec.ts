import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemMoiCongViecVer2Component } from './them-moi-cong-viec-ver2.component';

describe('ThemMoiCongViecVer2Component', () => {
  let component: ThemMoiCongViecVer2Component;
  let fixture: ComponentFixture<ThemMoiCongViecVer2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemMoiCongViecVer2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemMoiCongViecVer2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
