import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemMoiCongViecComponent } from './them-moi-cong-viec.component';

describe('ThemMoiCongViecComponent', () => {
  let component: ThemMoiCongViecComponent;
  let fixture: ComponentFixture<ThemMoiCongViecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemMoiCongViecComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemMoiCongViecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
