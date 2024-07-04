import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemMoiCongViecKhongVanBanComponent } from './them-moi-cong-viec-khong-van-ban.component';

describe('ThemMoiCongViecKhongVanBanComponent', () => {
  let component: ThemMoiCongViecKhongVanBanComponent;
  let fixture: ComponentFixture<ThemMoiCongViecKhongVanBanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemMoiCongViecKhongVanBanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemMoiCongViecKhongVanBanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
