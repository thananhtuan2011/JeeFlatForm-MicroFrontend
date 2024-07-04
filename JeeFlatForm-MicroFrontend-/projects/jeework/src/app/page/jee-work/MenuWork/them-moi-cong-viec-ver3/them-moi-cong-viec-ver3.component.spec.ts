import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemMoiCongViecVer3Component } from './them-moi-cong-viec-ver3.component';

describe('ThemMoiCongViecVer3Component', () => {
  let component: ThemMoiCongViecVer3Component;
  let fixture: ComponentFixture<ThemMoiCongViecVer3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemMoiCongViecVer3Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemMoiCongViecVer3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
