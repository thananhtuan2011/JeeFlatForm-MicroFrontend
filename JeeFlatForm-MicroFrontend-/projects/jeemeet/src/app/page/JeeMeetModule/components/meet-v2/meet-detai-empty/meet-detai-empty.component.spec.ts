import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetDetaiEmptyComponent } from './meet-detai-empty.component';

describe('MeetDetaiEmptyComponent', () => {
  let component: MeetDetaiEmptyComponent;
  let fixture: ComponentFixture<MeetDetaiEmptyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetDetaiEmptyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetDetaiEmptyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
