import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncodeChatComponent } from './encode-chat.component';

describe('EncodeChatComponent', () => {
  let component: EncodeChatComponent;
  let fixture: ComponentFixture<EncodeChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EncodeChatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EncodeChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
