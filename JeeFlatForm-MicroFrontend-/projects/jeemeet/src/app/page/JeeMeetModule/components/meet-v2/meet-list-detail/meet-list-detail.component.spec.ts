import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetListDetailComponent } from './meet-list-detail.component';

describe('MeetListDetailComponent', () => {
  let component: MeetListDetailComponent;
  let fixture: ComponentFixture<MeetListDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetListDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetListDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
