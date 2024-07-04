import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeviewItemComponent } from './treeview-item.component';

describe('TreeviewItemComponent', () => {
  let component: TreeviewItemComponent;
  let fixture: ComponentFixture<TreeviewItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreeviewItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeviewItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
