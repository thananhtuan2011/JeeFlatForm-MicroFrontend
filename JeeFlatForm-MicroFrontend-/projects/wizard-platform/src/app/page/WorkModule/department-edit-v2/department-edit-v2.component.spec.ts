import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentEditV2Component } from './department-edit-v2.component';

describe('DepartmentEditV2Component', () => {
  let component: DepartmentEditV2Component;
  let fixture: ComponentFixture<DepartmentEditV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartmentEditV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentEditV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
