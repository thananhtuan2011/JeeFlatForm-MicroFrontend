import {
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';

import {
  MatDialog,
} from '@angular/material/dialog';
import { TicKetService } from '../ticket.service';
import { PhanloaihotroModel } from '../component/Model/phan-loai-ho-tro-management.model';
import { LayoutUtilsService,MessageType } from 'projects/wizard-platform/src/modules/crud/utils/layout-utils.service';
import { TranslateService } from '@ngx-translate/core';
import { PhanloaihotroEditDialogComponent } from '../component/phan-loai-ho-tro-management-edit-dialog/phan-loai-ho-tro-management-edit-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { QueryParamsModel } from '../../models/query-models/query-params.model';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.scss'],
})
export class Step3Component implements OnInit {
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    'STT',
    'maloai',
    'tieude',
    'nguoiquanly',
    'linhvuc',
    'cachgiaoviec',
    'nguoihotro',
    'thoigian',
    'thaotac',
  ];
  wizard:any;
  constructor(
    private TicKetService:TicKetService,
    private ChangeDetectorRef:ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    public dialog: MatDialog,
    public cd: ChangeDetectorRef,
    private translateService: TranslateService,
    
  ) {

  }
  isloadding = false;
  data:any;
  Visible:boolean =false;
  sortOrder: string;
  sortField: string;
  flag: boolean;
  page: number;
  record: number;
  more: boolean;
  AllPage: number = 0;
  ngOnInit(): void {
    this.sortOrder = 'asc';
    this.sortField = '';
    this.page = 0;
    this.record = 10;
    this.more = false;
    this.flag = true;
   this.getwizard();
   this.loadData();
  }
  loadData(){
    let queryParams;
    queryParams = new QueryParamsModel(
      this.filter(),
      this.sortOrder,
      this.sortField,
      this.page,
      this.record,
      
      true
    );
    this.TicKetService.GetListPhanloaihotro(queryParams).subscribe(res=>{
      if(res && res.status ==1){
        this.dataSource.data = res.data;
        this.data = res.data;
        this.AllPage = res.panigator.AllPage;
        this.Visible = res.Visible;
        this.ChangeDetectorRef.detectChanges();
      }
     })
  }
  getwizard(){
    this.TicKetService.getWizard(3).subscribe(res=>{
      if(res && res.status==1){   
        this.wizard=res.data;
        this.isloadding=true;
        this.ChangeDetectorRef.detectChanges();
      }
    })
  }
  create() {
    const item = new PhanloaihotroModel();
    item.clear(); // Set all defaults fields
    this.update(item);
  }
  filter(): any {
    const filterNew: any = {

    };
    return filterNew;
  }
  onScroll(event: any) {
    if (
      event.target.offsetHeight + event.target.scrollTop + 110 >=
      event.target.scrollHeight
    ) {
      if (this.page + 1 < this.AllPage && this.flag) {
        this.flag = false;
        this.page++;
        this.LoadDataLazy();
      }
    }
  }
  LoadDataLazy() {
    let queryParams;
    queryParams = new QueryParamsModel(
      this.filter(),
      this.sortOrder,
      this.sortField,
      this.page,
      this.record, 
      true
    );

    this.TicKetService.GetListStatus(queryParams).subscribe(res => {
      if (res && res.status == 1) {
        this.dataSource.data = res.data;
        this.Visible = res.Visible;
        this.flag = true;
        this.ChangeDetectorRef.detectChanges();
      }
    })
  }
  update(item) {
    let saveMessageTranslateParam = '';
    saveMessageTranslateParam += item.RowID > 0 ? 'Cập nhật thành công' : 'Thêm thành công';
    const saveMessage = this.translateService.instant(saveMessageTranslateParam);
    const messageType = item.RowID > 0 ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(PhanloaihotroEditDialogComponent, { 
      data: { item },
      width:'700px'
     });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.layoutUtilsService.showActionNotification(saveMessage, messageType, 4000, true, false);
        this.loadData();
      } 
    });
  }

  getHeight(): any {
    let tmp_height = 0;
    tmp_height = 597 - 355;
    return tmp_height + 'px';
  }


  delete(RowID) {
    const _title = 'Xóa phân loại hỗ trợ';
    const _description = 'Bạn có chắc muốn xóa phân loại này không?';
    const _waitDesciption = "Dữ liệu đang được xử lý";

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.TicKetService.DeletePhanloaihotro(RowID).subscribe((res) => {
        if(res && res.statusCode === 1){
          this.loadData();
        }
        else{
          this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
        }
        }
      );
    });

  }
  getAssignMethod(AssignMethod: number) {
    if (AssignMethod === 1)
      return this.translateService.instant('Người quản lý phân công xử lý');
    if (AssignMethod === 2)
      return this.translateService.instant('Giao cho người ít việc nhất trong danh sách người hỗ trợ');
    if (AssignMethod === 3)
      return this.translateService.instant('Nhân viên chủ động nhận công việc');
    if (AssignMethod === 4)
      return this.translateService.instant('Tất cả thành viên đều có thể hỗ trợ');
  }
  getAgent_Admin(ID: string) {
    return ID.split(",");
  }


	CheckRule(val, id) {
		if (val.indexOf(id) !== -1) {
			return true;
		}
		return false;
	}
  getName(val) {
		var x = val.split(' ');
		return x[x.length - 1];
	}
	getColorNameUser(fullname) {
		var name = this.getNameUser(fullname).substr(0, 1);
		switch (name) {
			case 'A':
				return '#6FE80C';
			case 'B':
				return '#02c7ad';
			case 'C':
				return 'rgb(123, 104, 238)';
			case 'D':
				return '#16C6E5';
			case 'Đ':
				return '#959001';
			case 'E':
				return '#16AB6B';
			case 'G':
				return '#2757E7';
			case 'H':
				return '#B70B3F';
			case 'I':
				return '#390FE1';
			case 'J':
				return 'rgb(4, 169, 244)';
			case 'K':
				return '#2209b7';
			case 'L':
				return '#759e13';
			case 'M':
				return 'rgb(255, 120, 0)';
			case 'N':
				return '#bd3d0a';
			case 'O':
				return '#10CF99';
			case 'P':
				return '#B60B6F';
			case 'Q':
				return 'rgb(27, 188, 156)';
			case 'R':
				return '#6720F5';
			case 'S':
				return '#14A0DC';
			case 'T':
				return 'rgb(244, 44, 44)';
			case 'U':
				return '#DC338B';
			case 'V':
				return '#DF830B';
			case 'X':
				return 'rgb(230, 81, 0)';
			case 'W':
				return '#BA08C7';
			default:
				return '#21BD1C';
		}
	}

	getNameUser(val) {
		if (val) {
			var list = val.split(' ');
			return list[list.length - 1];
		}
		return '';
	}
}
