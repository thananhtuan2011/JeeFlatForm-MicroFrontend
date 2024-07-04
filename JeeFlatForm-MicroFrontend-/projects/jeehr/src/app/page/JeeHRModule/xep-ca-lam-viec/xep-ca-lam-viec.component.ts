import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { DanhMucChungService } from "../../services/danhmuc.service";
import { Router } from "@angular/router";

@Component({
    selector: 'xep-ca-lam-viec',
    templateUrl: './xep-ca-lam-viec.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class XepCaLamViecComponent implements OnInit {
    constructor(
        private danhMucChungService: DanhMucChungService,
        private router: Router,
    ) {

    }

    ngOnInit(): void {
        var role = [];
        var roles = this.danhMucChungService.getRoles().split(',');
        if (roles)
            role = roles.filter(x => x == 503);

        if (role.length === 0) {
            this.router.navigate(['HR/DonTu']);
        }
    }
}