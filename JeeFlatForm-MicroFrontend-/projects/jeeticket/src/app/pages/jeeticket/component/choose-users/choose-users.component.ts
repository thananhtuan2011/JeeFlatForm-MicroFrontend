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
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
// Material
import { MatDialog } from "@angular/material/dialog";
// RxJS
import { ReplaySubject } from "rxjs"; 
import { JeeTicKetLiteService } from "../../_services/JeeTicketLite.service";
import { LayoutUtilsService } from "projects/jeeticket/src/app/modules/crud/utils/layout-utils.service";
// NGRX
// Service
//Models

//import { JeeWorkLiteService } from '../services/wework.services';

@Component({
  selector: "kt-choose-users",
  templateUrl: "./choose-users.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ChooseUsersComponent implements OnInit, OnChanges {
  // Public properties
  @Input() options: any = {
    showSearch: true, //hiển thị search input hoặc truyền keyword
    keyword: "",
    data: [],
  };
  @Input() isNewView = false;
  @Output() ItemSelected = new EventEmitter<any>();
  @Output() IsSearch = new EventEmitter<any>();

  listUser: any[] = [];
  customStyle: any = [];
  public filteredUsers: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public userFilterCtrl: FormControl = new FormControl();
  constructor(
    private FormControlFB: FormBuilder,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private changeDetectorRefs: ChangeDetectorRef,
    private liteService:JeeTicKetLiteService,
  ) {}

  /**
   * On init
   */
  ngOnInit() {
    this.userFilterCtrl.valueChanges.pipe().subscribe(() => {
      this.filterUsers();
    });
  }
  ngOnChanges() {
    this.userFilterCtrl.setValue("");
    this.listUser = [];

    if (this.options.showSearch == undefined) this.options.showSearch = true;
    if (this.options != undefined) {
      if (this.options.data) {
        this.listUser = this.options.data;
        this.filterUsers();
        this.changeDetectorRefs.detectChanges();
      } else {
        this.liteService.list_account().subscribe((res) => {
          if (res && res.status === 1) {
            this.listUser = res.data;
            // mảng idnv exclude
            if (this.options.excludes && this.options.excludes.length > 0) {
              var arr = this.options.excludes;
              this.listUser = this.listUser.filter(
                (x) => !arr.includes(x.userid)
              );
            }
            this.filterUsers();
            this.changeDetectorRefs.detectChanges();
          }
        });
      }
    }
    if (!this.options.showSearch) this.filterUsers();
  }
  protected filterUsers() {
    if (!this.listUser) {
      return;
    }

    let search = !this.options.showSearch
      ? this.options.keyword
      : this.userFilterCtrl.value;
    if (!search) {
      this.filteredUsers.next(this.listUser.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    if (search[0] == "@") {
      this.filteredUsers.next(
        this.listUser.filter(
          (bank) =>
            bank.fullname.toLowerCase().indexOf(search.replace("@", "")) > -1
        )
      );
    } else {
      this.filteredUsers.next(
        this.listUser.filter(
          (bank) => bank.fullname.toLowerCase().indexOf(search) > -1
        )
      );
    }
  }
  select(user) {
    this.ItemSelected.emit(user);
  }
  stopPropagation(event) {
    this.IsSearch.emit(event);
  }
  getName(val) {
    if(!val) return;
    // console.log('val',val);
    var x = val.split(" ");
    // console.log('x', x[x.length - 1]);
    return x[x.length - 1];
  }
  getColorNameUser(item: any) {
    //let value = item.split(" ")[item.split(" ").length - 1];
    let result = "";
    if(!item) return;
    switch (item.slice(0, 1)) {
      case "A":
        return (result = "rgb(51 152 219)");
      case "Ă":
        return (result = "rgb(241, 196, 15)");
      case "Â":
        return (result = "rgb(142, 68, 173)");
      case "B":
        return (result = "#0cb929");
      case "C":
        return (result = "rgb(91, 101, 243)");
      case "D":
        return (result = "rgb(44, 62, 80)");
      case "Đ":
        return (result = "rgb(127, 140, 141)");
      case "E":
        return (result = "rgb(26, 188, 156)");
      case "Ê":
        return (result = "rgb(51 152 219)");
      case "G":
        return (result = "rgb(241, 196, 15)");
      case "H":
        return (result = "rgb(248, 48, 109)");
      case "I":
        return (result = "rgb(142, 68, 173)");
      case "K":
        return (result = "#2209b7");
      case "L":
        return (result = "rgb(44, 62, 80)");
      case "M":
        return (result = "rgb(127, 140, 141)");
      case "N":
        return (result = "rgb(197, 90, 240)");
      case "O":
        return (result = "rgb(51 152 219)");
      case "Ô":
        return (result = "rgb(241, 196, 15)");
      case "Ơ":
        return (result = "rgb(142, 68, 173)");
      case "P":
        return (result = "#02c7ad");
      case "Q":
        return (result = "rgb(211, 84, 0)");
      case "R":
        return (result = "rgb(44, 62, 80)");
      case "S":
        return (result = "rgb(127, 140, 141)");
      case "T":
        return (result = "#bd3d0a");
      case "U":
        return (result = "rgb(51 152 219)");
      case "Ư":
        return (result = "rgb(241, 196, 15)");
      case "V":
        return (result = "#759e13");
      case "X":
        return (result = "rgb(142, 68, 173)");
      case "W":
        return (result = "rgb(211, 84, 0)");
    }
    return result;
  }
}
