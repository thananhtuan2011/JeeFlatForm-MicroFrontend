import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';


@Component({
	selector: 'app-jeemeeting',
	templateUrl: './jeemeeting.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class JeeMeetingComponent implements OnInit {
	constructor(
	) {}
	ngOnInit() {
	}
}
