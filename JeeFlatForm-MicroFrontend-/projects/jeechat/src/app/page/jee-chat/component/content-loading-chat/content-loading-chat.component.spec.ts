import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentLoadingChatComponent } from './content-loading-chat.component';

describe('ContentLoadingChatComponent', () => {
  let component: ContentLoadingChatComponent;
  let fixture: ComponentFixture<ContentLoadingChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentLoadingChatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentLoadingChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
