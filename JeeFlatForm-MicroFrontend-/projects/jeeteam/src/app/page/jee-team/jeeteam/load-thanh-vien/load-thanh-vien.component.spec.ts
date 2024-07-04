import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadThanhVienComponent } from './load-thanh-vien.component';

describe('LoadThanhVienComponent', () => {
  let component: LoadThanhVienComponent;
  let fixture: ComponentFixture<LoadThanhVienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadThanhVienComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadThanhVienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
