import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeMenberComponent } from './tree-menber.component';

describe('TreeMenberComponent', () => {
  let component: TreeMenberComponent;
  let fixture: ComponentFixture<TreeMenberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreeMenberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeMenberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
