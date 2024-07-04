import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotAIComponent } from './chatbot-ai.component';

describe('ChatbotAIComponent', () => {
  let component: ChatbotAIComponent;
  let fixture: ComponentFixture<ChatbotAIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatbotAIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatbotAIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
