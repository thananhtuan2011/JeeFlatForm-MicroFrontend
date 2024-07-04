
// Angular
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef,
  Inject,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  OnChanges,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
// Material
import { MatDialog } from '@angular/material/dialog';
// RxJS
import { ReplaySubject } from 'rxjs';
// NGRX
// Service
//Models

import { DanhMucChungService } from '../services/danhmuc.service';
import { TagsModel } from '../models/JeeWorkModel';
import { LayoutUtilsService, MessageType } from 'projects/jeemeet/src/modules/crud/utils/layout-utils.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'kt-choose-milestone-and-tags',
  templateUrl: './choose-milestone-and-tags.component.html',
  // styleUrls: ['../danh-sach-nhiem-vu/danh-sach-nhiem-vu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // encapsulation: ViewEncapsulation.None,
})
export class ChooseMilestoneAndTagComponent implements OnInit, OnChanges {
  @Input() isNewView = false;
  @Input() element: any;
  @Input() idDept: any;
  @Output() ItemSelected = new EventEmitter<any>();
  @Output() IsSearch = new EventEmitter<any>();
  @Output() RemoveTag = new EventEmitter<any>();
  @ViewChild('input', { static: true }) input: ElementRef;
  colorNew = 'rgb(255, 0, 0)';
  listUserFull: any[] = [];
  listUser: any[] = [];
  customStyle: any = [];
  public filteredUsers: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public userFilterCtrl: FormControl = new FormControl();
  listDuAn: any;
  constructor(
    private FormControlFB: FormBuilder,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    public DanhMucService: DanhMucChungService,
    private changeDetectorRefs: ChangeDetectorRef
  ) {}

  /**
   * On init
   */
  ngOnInit() {
    this.loadTags();
    this.userFilterCtrl.valueChanges.pipe().subscribe(() => {
      this.filterUsers();
    });
  }
  ngOnChanges() {
	// debugger
    // this.userFilterCtrl.setValue('');
    // this.filterUsers();
	this.loadTags();
    // this.changeDetectorRefs.detectChanges();
  }
  protected filterUsers() {
    if (!this.listUser) {
      return;
    }
  }
  select(user) {
    this.ItemSelected.emit(user);
  }
  stopPropagation(event) {
    this.IsSearch.emit(event);
  }

  list_Tag: any = [];
  list_TagFull: any = [];
  loadTags() {
    this.DanhMucService.ListTagByProject(
      this.idDept
    ).subscribe((res) => {
      if (res.status == 1) {
        this.list_Tag = res.data;
        this.list_TagFull = res.data;
        const ele1 = document.getElementById('searchfield') as HTMLInputElement;
        if (ele1&&ele1.value) {
          this.keyup(ele1.value);
        }
        this.changeDetectorRefs.detectChanges();
      }
    });
  }
  keyup(event) {
    event = event.toLowerCase();
    this.list_Tag = this.list_TagFull.filter(
      (bank) => bank.title.toLowerCase().indexOf(event) > -1
    );
  }
  createTag(event) {
    let title = event.target.value;
    if (!title || title == '') {
      return;
    }
    const ObjectModels = new TagsModel();
    ObjectModels.clear();
    ObjectModels.id_project_team = this.idDept;
    ObjectModels.title = title;
    ObjectModels.color = this.colorNew;
    this.DanhMucService.InsertTag(ObjectModels).subscribe((res) => {
      if (res && res.status === 1) {
        this.loadTags();
      } else {
        this.layoutUtilsService.showActionNotification(
          res.error.message,
          MessageType.Read,
          9999999999,
          true,
          false,
          3000,
          'top',
          0
        );
      }
      this.changeDetectorRefs.detectChanges();
    });
  }
  UpdateTag(event, item) {
    if (event) {
      item.color = event;
      const ObjectModels = new TagsModel();
      ObjectModels.clear();
      ObjectModels.id_row = item.rowid;
      ObjectModels.id_project_team = this.idDept;
      ObjectModels.title = item.title;
      ObjectModels.color = item.color;
      this.DanhMucService.UpdateTag(ObjectModels).subscribe((res) => {
        if (res && res.status === 1) {
          this.loadTags();
        }
        this.changeDetectorRefs.detectChanges();
      });
    }
  }
  DeleteTag(item) {
    this.DanhMucService.DeleteTag(item.rowid).subscribe((res) => {
      if (res && res.status === 1) {
		this.RemoveTag.emit(item);
        this.loadTags();
      } else {
        this.layoutUtilsService.showActionNotification(
          res.error.message,
          MessageType.Read,
          9999999999,
          true,
          false,
          3000,
          'top',
          0
        );
      }
      this.changeDetectorRefs.detectChanges();
    });
  }
}
