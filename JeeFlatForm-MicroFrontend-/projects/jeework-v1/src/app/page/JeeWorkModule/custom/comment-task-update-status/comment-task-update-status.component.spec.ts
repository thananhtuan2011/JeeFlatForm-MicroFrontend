import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentTaskUpdateStatusComponent } from './comment-task-update-status.component';

describe('CommentTaskUpdateStatusComponent', () => {
  let component: CommentTaskUpdateStatusComponent;
  let fixture: ComponentFixture<CommentTaskUpdateStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommentTaskUpdateStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentTaskUpdateStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
