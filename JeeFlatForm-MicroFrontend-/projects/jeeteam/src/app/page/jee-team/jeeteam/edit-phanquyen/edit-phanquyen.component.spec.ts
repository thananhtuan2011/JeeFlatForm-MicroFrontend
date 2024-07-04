import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPhanquyenComponent } from './edit-phanquyen.component';

describe('EditPhanquyenComponent', () => {
  let component: EditPhanquyenComponent;
  let fixture: ComponentFixture<EditPhanquyenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPhanquyenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPhanquyenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
