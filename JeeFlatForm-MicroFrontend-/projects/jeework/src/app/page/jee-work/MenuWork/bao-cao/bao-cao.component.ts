import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { DanhMucChungService } from "../../services/danhmuc.service";
import { Router } from "@angular/router";

@Component({
    selector: 'app-bao-cao',
    templateUrl: './bao-cao.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaoCaoComponent implements OnInit {
    constructor(
        public _DanhMucChungService: DanhMucChungService,
        private router: Router,
    ) {

    }
    ngOnInit(): void {
        this._DanhMucChungService.CheckAuthorizeReport().subscribe(res => {
            if (res && res.status == 0) {
                this.router.navigate(['/WorkV2']);
            }
        })
    }
}