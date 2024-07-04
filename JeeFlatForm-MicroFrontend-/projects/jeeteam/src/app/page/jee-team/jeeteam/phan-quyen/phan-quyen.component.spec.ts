import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhanQuyenComponent } from './phan-quyen.component';

describe('PhanQuyenComponent', () => {
  let component: PhanQuyenComponent;
  let fixture: ComponentFixture<PhanQuyenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhanQuyenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhanQuyenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
