import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMemberChanelComponent } from './add-member-chanel.component';

describe('AddMemberChanelComponent', () => {
  let component: AddMemberChanelComponent;
  let fixture: ComponentFixture<AddMemberChanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMemberChanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMemberChanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
