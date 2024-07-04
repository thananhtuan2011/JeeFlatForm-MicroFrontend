import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatedChannelComponent } from './created-channel.component';

describe('CreatedChannelComponent', () => {
  let component: CreatedChannelComponent;
  let fixture: ComponentFixture<CreatedChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatedChannelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatedChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
