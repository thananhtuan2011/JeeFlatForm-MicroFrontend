import { JeeMeetingModule } from './../../../../../jeemeeting/src/app/page/JeeMeetingModule/jeemeeting.module';
import { MenuServices } from 'src/app/_metronic/core/services/menu.service';
import { AnimationBuilder, style } from '@angular/animations';
import { DetailChatComponent } from './component/detail-chat/detail-chat.component';
import { ThemeService } from './../../../../../../src/app/_metronic/core/services/theme.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import { JeeChatRoutingModule } from './jee-chat-routing.module';
import { MychatContactComponent } from './component/mychat-contact/mychat-contact.component';
import { MatButtonModule } from '@angular/material/button';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ThanhVienGroupComponent } from './component/thanh-vien-group/thanh-vien-group.component';
import { TaoBinhChonComponent } from './component/tao-binh-chon/tao-binh-chon.component';
import { SliderMessageComponent } from './component/slider-message/slider-message.component';
import { ShareMessageComponent } from './component/share-message/share-message.component';
import { ProcessDownloadComponent } from './component/process-download/process-download.component';
import { PreviewfileComponent } from './component/previewfile/previewfile.component';
import { PreviewAllimgComponent } from './component/preview-allimg/preview-allimg.component';
import { LoadVoteComponent } from './component/load-vote/load-vote.component';
import { InsertThanhvienComponent } from './component/insert-thanhvien/insert-thanhvien.component';
import { EncodeChatComponent } from './component/encode-chat/encode-chat.component';
import { EditGroupNameComponent } from './component/edit-group-name/edit-group-name.component';
import { CreateConvesationGroupComponent } from './component/create-convesation-group/create-convesation-group.component';
import { CreateConversationUserComponent } from './component/create-conversation-user/create-conversation-user.component';
import { ContentLoadingChatComponent } from './component/content-loading-chat/content-loading-chat.component';
import { ContentLoadingComponent } from './component/content-loading/content-loading.component';
import { CallVideoComponent } from './component/call-video/call-video.component';
import { CallOrtherComponent } from './component/call-orther/call-orther.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { AvatarModule } from 'ngx-avatar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgbCollapseModule, NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { HttpClientModule } from '@angular/common/http';
import { PopoverModule } from 'ngx-smart-popover';
import { TranslateModule } from '@ngx-translate/core';
import { AngularImageViewerModule } from 'image-viewer-dps';
import { InlineSVGModule } from 'ng-inline-svg';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { GalleryModule } from 'ng-gallery';
import { NgxAutoScrollModule } from 'ngx-auto-scroll';
import { LightboxModule } from 'ng-gallery/lightbox';
import { DeleteEntityDialogComponent } from 'projects/jeechat/src/modules/crud/delete-entity-dialog/delete-entity-dialog.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { DateTimeFormatPipe } from './pipes/date-time-format.pipe';
import { DisplayDateTimeFormatPipe } from './pipes/DisplayDateformat.pipe';
import { FilterPipe } from './pipes/filter.pipe';
import { HighlightPipe } from './pipes/highlight.pipe';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { TimeLastPipe } from './pipes/time-lastmess.pipe';
import { DndDirective } from './component/detail-chat/dnd.directive';
import { ChatService } from './services/chat.service';
import { LayoutUtilsService } from 'projects/jeechat/src/modules/crud/utils/layout-utils.service';
import { MessageService } from './services/message.service';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TranslationService } from 'projects/jeechat/src/modules/i18n/translation.service';
import './../../../styles.scss';
import { ActionNotificationComponent } from 'projects/jeechat/src/modules/crud/action-natification/action-notification.component';
import { PresenceService } from './services/presence.service';
import { VideoRecordingService } from './services/video-recording.service';
import { CongViecTheoDuAnListComponentChat } from './component/cong-viec-theo-du-an-list-chat/cong-viec-theo-du-an-list-chat.component';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { FormatTimeService } from './component/cong-viec-theo-du-an-list-chat/jee-format-time.component';
import { ChatbotAIComponent } from './component/chatbot-ai/chatbot-ai.component';
// projects\jeechat\src\styles.scss
@NgModule({
  declarations: [
    MychatContactComponent,
    CallOrtherComponent,
    CallVideoComponent,
    DetailChatComponent,
    ContentLoadingComponent,
    ContentLoadingChatComponent,
    CreateConversationUserComponent,
    CreateConvesationGroupComponent,
    PreviewfileComponent,
    DndDirective,
    EditGroupNameComponent,
    EncodeChatComponent,
    LoadVoteComponent,
    CongViecTheoDuAnListComponentChat,
    InsertThanhvienComponent,
    ThanhVienGroupComponent,
    TaoBinhChonComponent,
    PreviewAllimgComponent,
    ProcessDownloadComponent,
    SliderMessageComponent,
    ShareMessageComponent,
    DateTimeFormatPipe,
    DisplayDateTimeFormatPipe,
    FilterPipe,
    HighlightPipe,
    TimeAgoPipe,
    TimeLastPipe,
    ActionNotificationComponent,
    DeleteEntityDialogComponent,
    ChatbotAIComponent,
  ],
  entryComponents: [CreateConvesationGroupComponent, CreateConversationUserComponent,
    EditGroupNameComponent, ShareMessageComponent, CallVideoComponent,
    // DangKyCuocHopPageComponent,
    // ZoomConfigComponent,
    ActionNotificationComponent,
    EncodeChatComponent,
    PreviewAllimgComponent,
    TaoBinhChonComponent,
    CallOrtherComponent,
    DeleteEntityDialogComponent,
    PreviewfileComponent,
    // GoogleConfigComponent,
    // JeeChooseMemberComponent,
    // WebexComponent,

    ThanhVienGroupComponent, InsertThanhvienComponent
  ],
  providers: [
    ChatService,
    LayoutUtilsService,
    ThemeService,
    FormatTimeService,
    MessageService,
    PresenceService,
    MenuServices,
    VideoRecordingService,
    TranslationService,
  ],
  imports: [
    CommonModule,
    VirtualScrollerModule,
    MatProgressSpinnerModule,
    AngularImageViewerModule,
    RouterModule,
    NgxMatSelectSearchModule,
    MatSortModule,
    MatCheckboxModule,
    MatSelectModule,
    MatMomentDateModule,
    // UiScrollModule,
    MatDatepickerModule,
    MatRadioModule,
    MatExpansionModule,
    MatSidenavModule,
    QuillModule.forRoot(),
    // CKEditorModule,
    PopoverModule,
    LightboxModule,
    GalleryModule,
    PickerModule,
    TranslateModule.forRoot(),
    MatMenuModule,
    NgbModule,
    MatProgressBarModule,
    MatInputModule,
    MatDialogModule,
    MatTooltipModule,
    AvatarModule,
    ScrollingModule,
    MatIconModule,
    FormsModule,
    InlineSVGModule,
    MatTabsModule,
    NgbTooltipModule,
    NgxAutoScrollModule,
    MatBadgeModule,
    MatCardModule,
    MatInputModule,
    MatDialogModule,
    MatFormFieldModule,
    MatChipsModule,
    MatAutocompleteModule,
    PerfectScrollbarModule,
    MatButtonModule,
    MatIconModule,
    JeeChatRoutingModule,
    NgxDocViewerModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbCollapseModule,
    CollapseModule.forRoot(),
    CommonModule,
    AccordionModule.forRoot(),
    // IvyGalleryModule,
    // TimeagoModule.forRoot(),
    TabsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    MatSnackBarModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    JeeMeetingModule
  ],
  exports: [
    CallVideoComponent, MychatContactComponent
  ],

})
export class JeeChatModule { }
