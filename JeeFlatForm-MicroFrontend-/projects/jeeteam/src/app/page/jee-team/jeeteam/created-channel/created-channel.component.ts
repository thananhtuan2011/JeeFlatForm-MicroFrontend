import { JeeTeamService } from './../services/jeeteam.service';
import { AuthService } from 'src/app/modules/auth';
import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Router } from '@angular/router';
import { map, startWith } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { ChannelModel } from '../model/ChannelModel';
import { MenuJeeTeamServices } from '../services/menu_jeeteam.service';
import { environment } from 'projects/jeeteam/src/environments/environment';

@Component({
  selector: 'app-created-channel',
  templateUrl: './created-channel.component.html',
  styleUrls: ['./created-channel.component.scss']
})
export class CreatedChannelComponent implements OnInit {

  valueradio: any;
  itemuser: any[] = [];
  list_Tag_edit: any = {}
  user_tam: any[] = []
  active_private: boolean;
  list_remove_tam: any[] = [];
  listUser: Observable<any[]>;
  userCtrl = new FormControl();
  userControl = new FormControl();
  separatorKeysCodes: number[] = [ENTER, COMMA];
  visible = true;
  selectable = true;
  removable = true;
  @ViewChild('userInput', { static: false }) userInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  name: string;
  ten_group: string;
  listTT_user: any = {};
  constructor(
    private router: Router,
    private dashboerd_services: JeeTeamService,
    private menu_services: MenuJeeTeamServices,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private changeDetectorRefs: ChangeDetectorRef,
    private dialogRef: MatDialogRef<CreatedChannelComponent>,) {

    const user = this.dashboerd_services.getAuthFromLocalStorage()['user'];
    this.name = user['customData']['personalInfo']['Fullname'];
  }
  changeComboo(event) {
    console.log('chnaged', event.value);

    if (event.value == "private") {
      this.active_private = true;

    }
    else {
      this.active_private = false;

    }
    this.changeDetectorRefs.detectChanges();


  }
  CloseDia(data = undefined) {
    this.dialogRef.close(data);
  }
  goBack() {

    this.dialogRef.close();

  }



  Item_Channel(): ChannelModel {
    const item = new ChannelModel();
    item.IdMenu = this.data.RowId;
    item.isPrivate = this.active_private;
    item.title = this.ten_group;
    if (this.user_tam.length > 0) {
      item.ListMemberChannel = this.user_tam.slice();
    }

    return item;
  }



  Createchanel() {

    let data = this.Item_Channel();
    this.menu_services.addChannel(data).subscribe(res => {
      if (res && res.status === 1) {
        this.CloseDia(res);
      }
    })

  }

  submit() {
    this.Createchanel();
  }


  addTagName(item: any) {

    let vitri;
    var tam = Object.assign({}, item);
    this.user_tam.push(tam);
    for (let i = 0; i < this.user_tam.length; i++) {
      let index = this.itemuser.findIndex(x => x.Username == this.user_tam[i].Username)
      vitri = index;
    }
    this.itemuser.splice(vitri, 1);

    this.listUser = this.userControl.valueChanges
      .pipe(
        startWith(''),
        map(state => state ? this._filterStates(state) : this.itemuser.slice())

      );


    this.userControl.setValue("");


  }
  remove(user: string): void {

    const index = this.user_tam.indexOf(user);

    if (index >= 0) {

      this.list_remove_tam.push(this.user_tam[index]);
      this.user_tam.splice(index, 1);
      for (let i = 0; i < this.list_remove_tam.length; i++) {
        this.itemuser.unshift(this.list_remove_tam[i])
        this.list_remove_tam.splice(i, 1);

      }



      this.listUser = this.userControl.valueChanges
        .pipe(
          startWith(''),
          map(state => state ? this._filterStates(state) : this.itemuser.slice())

        );

    }
  }

  add(event: MatChipInputEvent): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our fruit
      if ((value || '').trim()) {
        this.user_tam.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.userCtrl.setValue(null);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {

    let obj = this.user_tam.find(x => x.Username == event.option.viewValue);
    if (obj) {
      alert('Vui lòng chọn nhân viên khác !')
    }
    else {

      // let index=this.data_user.findIndex(x => x.hoten == event.option.viewValue);

      // this.list_load_user_chose.push(
      // {
      // id:this.data_user[index].id_user,
      // hoten:this.data_user[index].hoten,
      // avatar:this.data_user[index].avatar

      //}

      // )

      //  for(let i=0;i<this.list_load_user_chose.length;i++)
      //  {
      //   this.chuoi_user=this.chuoi_user+" "+this.list_load_user_chose[i].hoten+",";
      //   // this.chuoi_user=this.list_load_user_chose[i].hoten;
      //   this.danhsach_user=trim(this.chuoi_user,",");
      //  }




      this.user_tam.push(
        {
          //  ID_NV:this.id_nv.value,
          Username: event.option.viewValue,
        })


      this.remove(event.option.value);
      // this.userInput.nativeElement.value = '';
      // this.userCtrl.setValue(null);

      // let obj = this.user_tam.find(x => x.ID_type == event.option.value);
      //this.deleteHT1(obj);
      this.userInput.nativeElement.value = '';
      this.userCtrl.setValue(null);



    }
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }
  private _filterStates(value: string): any[] {
    // debugger
    //	const filterValue = value.toLowerCase();
    const filterValue = this._normalizeValue(value);
    return this.itemuser.filter(state => this._normalizeValue(state.Fullname).includes(filterValue));
  }

  loadTT() {
    this.dashboerd_services.getAllUsers().subscribe(res => {
      //  console.log(res);
      if (res.status == 1) {

        this.itemuser = res.data;
        for (let i = 0; i < this.user_tam.length; i++) {
          let vitri = this.itemuser.findIndex(x => x.UserId == this.user_tam[i].UserId)
          this.itemuser.splice(vitri, 1)
        }



        this.listUser = this.userControl.valueChanges
          .pipe(
            startWith(''),
            map(state => state ? this._filterStates(state) : this.itemuser.slice())

          );
        this.changeDetectorRefs.detectChanges();
      }


    })

  }

  loadTTuser() {

    const authData = this.dashboerd_services.getAuthFromLocalStorage();
    this.listTT_user = authData.user.customData.personalInfo;
  }

  ngOnInit(): void {
    // alert(this.data.RowId);
    this.valueradio = "public";

    this.loadTT();
    this.loadTTuser();
  }
}
