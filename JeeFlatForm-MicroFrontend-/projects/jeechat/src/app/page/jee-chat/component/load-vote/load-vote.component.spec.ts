import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadVoteComponent } from './load-vote.component';

describe('LoadVoteComponent', () => {
  let component: LoadVoteComponent;
  let fixture: ComponentFixture<LoadVoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadVoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadVoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
