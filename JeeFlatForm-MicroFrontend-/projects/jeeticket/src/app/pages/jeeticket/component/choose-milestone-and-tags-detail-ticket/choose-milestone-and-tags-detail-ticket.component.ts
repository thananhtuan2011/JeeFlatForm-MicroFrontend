import { values } from "lodash";
// import { TagsService } from './../tags/tags.service';
// import { LayoutUtilsService, MessageType } from './../../../_metronic/jeework_old/core/utils/layout-utils.service';

// Angular
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  OnChanges,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";
// Material
import { MatDialog } from "@angular/material/dialog";
// RxJS
import { ReplaySubject } from "rxjs";
// NGRX
//Models

import * as moment from "moment";
import { TranslateService } from "@ngx-translate/core";
import { JeeTicKetLiteService } from "../../_services/JeeTicketLite.service";
import { TagsModel } from "../../_models/listtag-management.model";
import { TagsManagementService } from "../../_services/listtag-management.service";
import { TicketTagsModel } from "../../_models/ticket-tags-management.model";
import { TicketTagsManagementService } from "../../_services/ticket-tags-management.service";
import { TicketRequestManagementService } from "../../_services/ticket-request-management.service";
import { LayoutUtilsService, MessageType } from "projects/jeeticket/src/app/modules/crud/utils/layout-utils.service";

// import { JeeWorkLiteService } from '../services/wework.services';
// import { ListDepartmentService } from '../department/Services/List-department.service';
// import { UpdateWorkModel } from '../work/work.model';
// import { WorkService } from '../work/work.service';
// import { milestoneDetailEditComponent } from '../department/milestone-detail-edit/milestone-detail-edit.component';
// import { TranslateService } from '@ngx-translate/core';
// import { TagsEditComponent } from '../tags/tags-edit/tags-edit.component';
// import { MilestoneModel, TagsModel } from '../projects-team/Model/department-and-project.model';

@Component({
  selector: "kt-choose-milestone-and-tags-detail-ticket",
  templateUrl: "./choose-milestone-and-tags-detail-ticket.component.html",
  styleUrls: ['././choose-milestone-and-tags-detail-ticket.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ChooseTagTicketComponent implements OnInit, OnChanges {
  // Public properties
  @Input() options: any[] = [];
  @Input() showcheck: any = false;
  @Input() item: any = [];
  @Output() ItemSelected = new EventEmitter<any>();
  @Output() Noclick = new EventEmitter<any>();
  //this.Id: TicketID
  @Input() Id?: number = 0;
  @Input() id_project_Team;
  @Input() project_team?: string = "";
  @Input() Id_key?: number = 0;
  @Input() auto = false;
  @Input() Loai?: string = "startdate";
  @Input() TagTicket: any = [];

  @ViewChild("input", { static: true }) input: ElementRef;
  colorNew = "rgb(255, 0, 0)";
  public filtered: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public FilterCtrl: FormControl = new FormControl();
  // model: UpdateWorkModel;
  model: TicketTagsModel;
  // item_mile = new MilestoneModel();
  list: any;
  milestoneSelected = 0;
  listTag: any = [];
  constructor(
    private FormControlFB: FormBuilder,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    // public weworkService: JeeWorkLiteService,
    // private _service: WorkService,
    // private deptmentServices: ListDepartmentService,
    private translate: TranslateService,
    private changeDetectorRefs: ChangeDetectorRef,
    public liteService: JeeTicKetLiteService,
    public tagService: TagsManagementService,
    public ticketTagService: TicketTagsManagementService,
    public TicketRequestManagementService: TicketRequestManagementService,

  ) {}

  /**
   * On init
   */
  ngOnInit() {
    var a = this.TagTicket;
    var b = this.options;
    this.list = this.options;

  }

  ngOnChanges() {
    //this.item_mile.id_project_team = this.id_project_Team;
    this.ngOnInit();
  }

  isTagTicket(id_row){
    
    if(this.TagTicket && this.TagTicket.length > 0 )
    {
      var index = this.TagTicket.findIndex(x=>x.RowID == id_row);
      if(index != -1) return '#cdcdcd';
      else return '';
    }
    return '';
  }
  //load task
  list_Tag: any = [];
  LoadTag() {
    this.liteService.list_tags().subscribe((res) => {
      this.changeDetectorRefs.detectChanges();
      if (res && res.status === 1) {
        this.list = res.data;
        this.changeDetectorRefs.detectChanges();
      }
    });
    // this.liteService.list_tags().subscribe((res) => {
    //   if (res && res.statusCode === 1) {
    //     this.list = res.data;
    //     this.changeDetectorRefs.detectChanges();
    //   }
    // });
  }

  selected(tag) {
    if (this.auto) {
      this.ItemSelected.emit(tag);
      return;
    }
    this.model = new TicketTagsModel();
    this.model.TicketID = this.Id;
    this.model.TagID = tag.id_row;
    //this.layoutUtilsService.showWaitingDiv();
    this.ticketTagService.UpdateTicketTags(this.model).subscribe((res) => {
      //this.layoutUtilsService.OffWaitingDiv();
      if (res && res.status == 1) {
        this.ItemSelected.emit(tag);
        this.changeDetectorRefs.detectChanges();
        //this.layoutUtilsService.showActionNotification(this.translate.instant('work.dachon'), MessageType.Read, 1000, false, false, 3000, 'top', 1);
      } else {
        this.layoutUtilsService.showActionNotification(
          res.error.message,
          MessageType.Read,
          9999999999,
          true,
          false,
          3000,
          "top",
          0
        );
      }
    });
    this.changeDetectorRefs.detectChanges();
  }
  UpdateTag(color, _item, withBack: boolean = false) {
    let tagItem = new TagsModel();
    tagItem.RowID = _item.id_row;
    tagItem.Color = color;
    tagItem.Tag = _item.title;

    // tagItem.id_row = _item.id_row;
    // tagItem.color = color;
    // tagItem.title = _item.title;
    //tagItem.id_project_team = this.id_project_Team;

    this.tagService.UpdateTags(tagItem).subscribe((res) => {
      if (res && res.statusCode === 1) {
        this.ItemSelected.emit(true);
        this.LoadTag();
      } else {
        this.layoutUtilsService.showActionNotification(
          res.error.message,
          MessageType.Read,
          9999999999,
          true,
          false,
          3000,
          "top",
          0
        );
      }
    });
    this.changeDetectorRefs.detectChanges();
  }
  createmilestone() {}
  Update() {
    // this.item_mile.id_project_team = this.id_project_Team;
    // let saveMessageTranslateParam = "";
    // var _item = new MilestoneModel();
    // _item = this.item_mile;
    // _item.clear();
    // _item.id_project_team = this.id_project_Team;
    // saveMessageTranslateParam +=
    //   _item.id_row > 0
    //     ? "GeneralKey.capnhatthanhcong"
    //     : "GeneralKey.themthanhcong";
    // const _saveMessage = this.translate.instant(saveMessageTranslateParam);
    // const _messageType =
    //   _item.id_row > 0 ? MessageType.Update : MessageType.Create;
    // const reloadPage = false;
    // const dialogRef = this.dialog.open(milestoneDetailEditComponent, {
    //   data: { _item, reloadPage },
    // });
    // dialogRef.afterClosed().subscribe((res) => {
    //   if (!res) {
    //     return;
    //   } else {
    //     this.layoutUtilsService.showActionNotification(
    //       _saveMessage,
    //       _messageType,
    //       4000,
    //       true,
    //       false
    //     );
    //     this.changeDetectorRefs.detectChanges();
    //   }
    // });
  }

  createTags() {
    // const ObjectModels = new TagsModel();
    // ObjectModels.clear();
    // this.CreatedTag(ObjectModels);
  }
  //   CreatedTag(_item: TagsModel) {
  //     _item.id_project_team = "" + this.id_project_Team;
  //     _item.project_team = this.project_team;
  //     let saveMessageTranslateParam = "";
  //     saveMessageTranslateParam +=
  //       _item.id_row > 0
  //         ? "GeneralKey.capnhatthanhcong"
  //         : "GeneralKey.themthanhcong";
  //     const _saveMessage = this.translate.instant(saveMessageTranslateParam);
  //     const _messageType =
  //       _item.id_row > 0 ? MessageType.Update : MessageType.Create;
  //     const dialogRef = this.dialog.open(TagsEditComponent, {
  //       data: { _item },
  //     });
  //     dialogRef.afterClosed().subscribe((res) => {
  //       if (!res) {
  //         return;
  //       } else {
  //         this.LoadTag();
  //         // this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 4000, true, false);
  //         // this.changeDetectorRefs.detectChanges();
  //       }
  //     });
  //   }

  Create() {
    if (
      !this.input.nativeElement.value ||
      this.input.nativeElement.value == ""
    ) {
      return;
    }
    const tagModel = new TagsModel();
    tagModel.clear();
    tagModel.Tag = this.input.nativeElement.value;
    tagModel.Color = this.colorNew;

    this.tagService.CreateTags(tagModel).subscribe((res) => {
      this.changeDetectorRefs.detectChanges();

      if (res && res.status === 1) {
        this.input.nativeElement.value = "";
        this.LoadTag();
        this.selected(res.data);
        this.TicketRequestManagementService.getTiceketPCByRowID(
          this.Id
        ).subscribe((res) => {
          if (res.status == 1) {

            this.changeDetectorRefs.detectChanges();


          }
        });

      } else {
        this.layoutUtilsService.showActionNotification(
          res.error.message,
          MessageType.Read,
          9999999999,
          true,
          false,
          3000,
          "top",
          0
        );
      }
    });
  }
  Delete(id) {
    //id: List_Tag.RowID, Ticket_Tags.TagID
    //this.Id: TicketID
    this.ticketTagService.DeleteTicketTagsByTagId(id).subscribe((res) => {
      if (res && res.statusCode === 1) {
        this.ItemSelected.emit(true);
        this.LoadTag();
        this.TicketRequestManagementService.getTiceketPCByRowID(
          this.Id
        ).subscribe((res) => {
          if (res.status == 1) {

            this.changeDetectorRefs.detectChanges();


          }
        });
        //this.ticketManagementService.fetch();
      } else {
        this.layoutUtilsService.showActionNotification(
          res.error.message,
          MessageType.Read,
          9999999999,
          true,
          false,
          3000,
          "top",
          0
        );
      }
    });
  }
  stopPropagation(event) {
    this.Noclick.emit(event);
  }
}
