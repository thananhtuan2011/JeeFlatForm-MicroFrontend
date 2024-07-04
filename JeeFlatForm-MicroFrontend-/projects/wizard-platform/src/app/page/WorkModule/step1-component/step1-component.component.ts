import { catchError, finalize, share, tap } from 'rxjs/operators';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  Optional,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { WorkwizardChungService } from '../work.service';
import { LayoutUtilsService } from 'projects/wizard-platform/src/modules/crud/utils/layout-utils.service';
@Component({
  selector: 'app-step1-component',
  templateUrl: './step1-component.component.html',
  styleUrls: ['./step1-component.component.scss'],
})
export class Step1ComponentComponent implements OnInit {
  constructor(
    private router: Router,
    private _WorkwizardChungService: WorkwizardChungService,
    private changeDetectorRefs: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
  ) {
  }
  Data: any;
  isLoad: boolean = false;
  nodes: any = [
    {
      name: 'Sundar Pichai',
      cssClass: 'ngx-org-ceo thien-class',
      image: '',
      title: 'Chief Executive Officer',
      id: 100,
      childs: [
        {
          name: 'Thomas Kurian',
          cssClass: 'ngx-org-ceo',
          image: 'assets/node.svg',
          title: 'CEO, Google Cloud',
          id: 100,
        },
        {
          name: 'Susan Wojcicki',
          cssClass: 'ngx-org-ceo',
          image: 'assets/node.svg',
          title: 'CEO, YouTube',
          id: 100,
          childs: [
            {
              name: 'Beau Avril',
              cssClass: 'ngx-org-head',
              image: 'assets/node.svg',
              title: 'Global Head of Business Operations',
              id: 100,
              childs: []
            },
            {
              name: 'Tara Walpert Levy',
              cssClass: 'ngx-org-vp',
              image: 'assets/node.svg',
              title: 'VP, Agency and Brand Solutions',
              id: 100,
              childs: []
            },
          ]
        },
      ]
    },
  ];
  datanodes: any = [
    {
      name: 'Phân hệ công việc',
      cssClass: '',
      image: '',
      title: 'Workspace',
      id: 100,
      childs: [
        {
          name: 'Cấp phòng ban',
          cssClass: '',
          image: '',
          title: 'Phòng kế toán',
          id: 100,
          childs: [
            {
              name: 'Cấp dự án',
              cssClass: '',
              image: '',
              title: 'Thanh toán',
              id: 100,
              childs: [],
            },
            {
              name: 'Cấp dự án',
              cssClass: '',
              image: '',
              title: 'Thu chi - thuế',
              id: 100,
              childs: [
                {
                  name: 'Cấp công việc',
                  cssClass: 'user',
                  image: '',
                  title: 'Công việc 1',
                  id: 100,
                  childs: [],
                },
                {
                  name: 'Cấp công việc',
                  cssClass: 'user',
                  image: '',
                  title: 'Công việc 2',
                  id: 100,
                  childs: []
                },
              ]
            },
          ]
        },
        {
          name: 'Cấp phòng ban',
          cssClass: '',
          image: '',
          title: 'Dự án chính phủ',
          id: 100,
          childs: [
            {
              name: 'Cấp dự án ',
              cssClass: '',
              image: '',
              title: 'Dự án 1',
              id: 100,
              childs: [
                {
                  name: 'Cấp công việc',
                  cssClass: 'user',
                  image: '',
                  title: 'Công việc 3',
                  id: 100,
                  childs: [],
                },
                {
                  name: 'Cấp công việc',
                  cssClass: 'user',
                  image: '',
                  title: 'Công việc n..',
                  id: 100,
                  childs: []
                },
              ],
            },
            {
              name: 'Cấp dự án',
              cssClass: '',
              image: '',
              title: 'Dự án 2',
              id: 100,
              childs: []
            },
          ]
        },
      ]
    },
  ];
  listApp: any[] = [];
  ngOnInit(): void {
    this._WorkwizardChungService.GetWizard(1).subscribe(res => {
      if (res && res.status == 1) {
        this.isLoad = true;
        this.Data = res.data;
        this.changeDetectorRefs.detectChanges();
      }
    })
    this._WorkwizardChungService.getListApp().subscribe(res => {
      if (res && res.status == 1) {
        this.listApp = res.data
      }
      this.changeDetectorRefs.detectChanges();
    })
  }
  getHeight(): any {
    let tmp_height = 597 - 230;
    return tmp_height + "px";
  }
  //=====================Bổ sung nút Sử dụng dữ liệu măc định - Thiên (05/04/2024)=======
  ClickDataDefault() {
    this.layoutUtilsService.Confirm_Wizard('Sử dụng dữ liệu mặc định',
      'Hệ thống sẽ khởi tạo dữ liệu mặc định cho các thiết lập và sẽ đánh dấu hoàn thành thiết lập cho phân hệ này. Bạn có thể thay đổi các thiết lập này sau bằng cách vào ứng dụng bằng quyền admin hệ thống hoặc admin của ứng dụng. Có đúng là bạn muốn dùng dữ liệu mặc định và bỏ qua thiết lập?',
      "Đóng", "Đồng ý")
      .then((res) => {
        if (res) {
          this._WorkwizardChungService.UpdateInitStatusApp().subscribe(res => {
            if (res && res.statusCode === 1) {
              let obj = this.listApp.find(x => x.AppID == 34);
              if (obj) {
                window.location.href = obj.BackendURL;
              } else {
                this.router.navigate([`Config-System/3`]);
              }
            }
          })
        }
      })
      .catch((err) => { });
  }
}