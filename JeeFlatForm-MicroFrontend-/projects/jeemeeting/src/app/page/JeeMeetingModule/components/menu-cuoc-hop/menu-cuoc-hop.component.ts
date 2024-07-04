import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { DangKyCuocHopService } from '../../_services/dang-ky-cuoc-hop.service';
import { MeetingStore } from '../../_services/meeting.store';
import { TaoCuocHopDialogComponent } from '../tao-cuoc-hop-dialog/tao-cuoc-hop-dialog.component';
import { TranslationService } from 'projects/jeemeeting/src/modules/i18n/translation.service';
import { TranslateService } from '@ngx-translate/core';
import { locale as viLang } from '../../../../../../src/modules/i18n/vocabs/vi';
@Component({
  selector: 'app-menu-cuoc-hop',
  templateUrl: './menu-cuoc-hop.component.html',
  styleUrls: ['./menu-cuoc-hop.component.scss']
})
export class MenuCuocHopComponent implements OnInit {
  activeTabId:
  | 'kt_quick_panel_logs'
  | 'kt_quick_panel_notifications'
  | 'kt_quick_panel_settings' = 'kt_quick_panel_logs';
    tinhTrang: string = "0"
    minDate: string = ''
    maxDate: string = ''
    TuNgay: string = ''
    DenNgay: string = ''
    keyword:string
    labelFilter: string = 'Tất cả';
    isLoad:string = '';
    status:string = '1'
    Type:string = '1';
    createType:boolean = false;
    soluongtoithamgia:any = 0
    soluongtoicapnhat:any = 0
    selectedTab:number = 0
  constructor(public dangKyCuocHopService: DangKyCuocHopService,
    private changeDetectorRefs: ChangeDetectorRef,
    private router: Router,
    private store: MeetingStore,
    public dialog: MatDialog,
    private translationService: TranslationService,
    private translate: TranslateService,
    ) {this.translationService.loadTranslations(
      viLang,
  );
  var langcode = localStorage.getItem('language');
  if (langcode == null)
      langcode = this.translate.getDefaultLang();
  this.translationService.setLanguage(langcode); }

  ngOnInit() {
    this.store.data_shareActived$.subscribe((data:any)=>{
			if(data && data !=''){
				if(data == '0'){
					this.selectedTab = 0;
          this.changeDetectorRefs.detectChanges()
				}
				if(data == '1'){
					this.selectedTab = 1;
          this.changeDetectorRefs.detectChanges()
				}
        if(data == '2'){
					this.selectedTab = 2;
          this.changeDetectorRefs.detectChanges()
				}
			}
		})
    this.dangKyCuocHopService.SoLuongChoCapNhat(4).subscribe(res => {
			if (res) {
				 this.soluongtoithamgia = res
      }
      this.changeDetectorRefs.detectChanges()
		});
    this.dangKyCuocHopService.SoLuongChoCapNhat(5).subscribe(res => {
			if (res) {
				 this.soluongtoicapnhat = res
      }
      this.changeDetectorRefs.detectChanges()
		});
    this.createType = false
  }
  setActiveTabId(tabId,type) {
    this.activeTabId = tabId;
	  this.isLoad = tabId
    this.Type = type
  	}

  	getActiveCSSClasses(tabId) {
    if (tabId !== this.activeTabId) {
      return '';
    }
    return 'active show chieucao';
  }

  onLinkClick(eventTab: MatTabChangeEvent) {
		this.selectedTab = eventTab.index;
    this.changeDetectorRefs.detectChanges();

  }
  loadDataList(){

  }

  taoMoiCuocHop() {
    //this.router.navigate(['/Meeting/create/',0]);
    const dialogRef = this.dialog.open(TaoCuocHopDialogComponent, {disableClose:true,
      panelClass:'no-padding',width: '40%' });
      dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }})
  }

  getWidth(){
    let tmp_width = 0;
    tmp_width = window.innerWidth - 420;
    return tmp_width + 'px';
  }
  getHeight(): any {
    let tmp_height = 0;
    tmp_height = window.innerHeight;
    return tmp_height + 'px';
   }

  ngOnDestroy(): void {
    this.createType = false
    this.changeDetectorRefs.detectChanges();
  }
}
