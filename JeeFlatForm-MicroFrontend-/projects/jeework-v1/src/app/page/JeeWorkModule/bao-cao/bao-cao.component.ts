import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

@Component({
    selector: 'app-bao-cao',
    templateUrl: './bao-cao.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaoCaoComponent implements OnInit {
    constructor(
    ) {

    }
    ngOnInit(): void {
    }
}