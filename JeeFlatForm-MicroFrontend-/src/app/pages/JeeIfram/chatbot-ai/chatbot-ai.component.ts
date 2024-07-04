import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Configuration, OpenAIApi } from 'openai';
import { BehaviorSubject } from 'rxjs';
import { ChatbotService } from './chatbot.service';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-chatbot-ai',
  templateUrl: './chatbot-ai.component.html',
  styleUrls: ['./chatbot-ai.component.scss']
})
export class ChatbotAIComponent implements OnInit, AfterViewChecked {
  Name_ChatBot = environment.NAME_CHATBOT
  formats = [
    'background',
    'bold',
    'color',
    'font',
    'code',
    'italic',
    'link',
    'size',
    'strike',
    'script',
    'mention',
    'underline',
    'blockquote',
    'header',
    'indent',
    'list',
    'align',
    'direction',
    'code-block',
    'formula',
    // 'image',
    // 'video'
  ];

  chatConversation: any[] = [];
  response!: any | undefined;
  promptText: string = "";
  _loading$ = new BehaviorSubject<boolean>(
    false
  );
  txtam = ''
  Avataruser: string
  BgColor: string;
  Name: string;
  urlSafe: SafeResourceUrl;
  constructor(private chat_bot_services: ChatbotService,
    private changeDetectorRefs: ChangeDetectorRef,
    public sanitizer: DomSanitizer,) {
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(environment.HOST_JEECHATBOT);
    window.addEventListener('message', (event) => {
      let item =
      {
        question: event.data.value.question_,
        answer: event.data.value.answer_
      }
      this.chat_bot_services.AddHis(item).subscribe(res => {

      })
    });

  }

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;




  ngOnInit(): void {
    this.pushChatContent("https://cdn.jee.vn/jee-chat/Icon/icchatbot.png", "Tôi có thể giúp gì được cho bạn ?", 'Mr Bot', 'bot');
  }
  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  checkResponse() {
    this.txtam = this.promptText;
    this.promptText = "";
    this.pushChatContent(null, this.txtam, 'You', 'person');
    this.invokeGPT();
  }


  pushChatContent(avatar: string, content: string, person: string, cssClass: string) {
    const chatToPush: any = { avatar: avatar, person: person, response: content, cssClass: cssClass };
    this.chatConversation.push(chatToPush);
    this.scrollToBottom();
    this.changeDetectorRefs.detectChanges();
  }


  getText(data: string) {
    return data.split('\n').filter(f => f.length > 0);
  }

  async invokeGPT() {


    if (this.txtam.length < 2)
      return;



    try {
      this.response = undefined;
      let configuration = new Configuration({ apiKey: environment.apiKey });
      let openai = new OpenAIApi(configuration);

      let requestData = {
        model: 'text-davinci-003',//'text-davinci-003',//"text-curie-001",
        prompt: this.txtam,//this.generatePrompt(animal),
        temperature: 0.95,
        max_tokens: 256,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      };
      this._loading$.next(true);
      let apiResponse = await openai.createCompletion(requestData);
      this.txtam = ""
      this.response = apiResponse.data;
      this.pushChatContent("https://cdn.jee.vn/jee-chat/Icon/icchatbot.png", this.response.choices[0].text.trim(), 'Mr Bot', 'bot');
      this._loading$.next(false);
      this.changeDetectorRefs.detectChanges();
    } catch (error: any) {
      this._loading$.next(false);
      // Consider adjusting the error handling logic for your use case
      if (error.response) {
        console.error(error.response.status, error.response.data);

      } else {
        console.error(`Error with OpenAI API request: ${error.message}`);

      }
    }
  }
  setFocus(editor) {

    editor.focus();
  }
}
