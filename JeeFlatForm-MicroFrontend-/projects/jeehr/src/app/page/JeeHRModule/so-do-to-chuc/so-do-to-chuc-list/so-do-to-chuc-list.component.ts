import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Pipe, PipeTransform } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";
import { TranslateService } from "@ngx-translate/core";
import { LyLichNhanVienListComponent } from "../ly-lich-nhan-vien-list/ly-lich-nhan-vien-list.component";
import { SoDoToChucService } from "../Services/so-do-to-chuc.service";


@Component({
    selector: 'app-so-do-to-chuc-list',
    templateUrl: './so-do-to-chuc-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SoDoToChucListComponent implements OnInit {
    dataSourceChart: any[];
    ListItemChart: any[];
    ID: string = '';
    constructor(
        private soDoToChucService: SoDoToChucService,
        private translate: TranslateService,
        public dialog: MatDialog,
        private changeDetectorRefs: ChangeDetectorRef,
    ) {

    }
    ngOnInit(): void {
        this.getDatasourceChart();
    }
    getDatasourceChart() {
        // this.layoutUtilsService.showWaitingDiv();
        this.soDoToChucService.GetOrganizationalChartById().subscribe(res => {
            // this.layoutUtilsService.OffWaitingDiv();
            this.dataSourceChart = res.data;
            this.ListItemChart = [];
            var total_col = this.dq(this.dataSourceChart[0]);
            this.genArr(this.dataSourceChart, this.ListItemChart, 0, 0);
            this.ListItemChart = this.SortLevelTree(this.ListItemChart);
            this.addFakeCol(this.ListItemChart);
            this.changeDetectorRefs.detectChanges();
        });
    }
    dq(data) {
        var _w = 0;
        data.children.forEach(element => {
            var _cw = 1;
            if (element.level_jobtitle >= data.level_jobtitle) {
                element.level_jobtitle = data.level_jobtitle - 1;
            }
            element.diff = data.level_jobtitle - element.level_jobtitle;
            //cho bien i chạy khi đủ tổng chiều dài thì gán biến  last child	
            if (element.children && element.children.length)
                _cw = this.dq(element);//element.children
            else {
                element.width = 1;
                element.children.width = 1;
            }
            _w += _cw;
        });
        data.children.width = _w;
        data.width = _w;
        return _w;
    }
    genArr(root, arr, level, startindex) {
        if (!arr[level]) {
            arr[level] = [];
        }
        var _offset = 0;
        var total_w = 0;
        var idx = 0;
        root.forEach(element => {
            var _cw = null;
            element.offset = startindex + _offset;
            if (idx == 0) {
                element.firstchild = true;
            }
            total_w += element.children.width;
            if (element.children && element.children.length) {
                _cw = this.genArr(element.children, arr, level + 1, startindex + _offset);
            }
            idx++;
            if (total_w == root.width) {
                element.lastchild = true;
            }
            if (element.children.width)
                _offset += element.children.width;
            else
                _offset += 1;
            arr[level].push(element);
        });
        return null;
    }
    SortLevelTree(arr_chart) {
        ;
        var level_max = arr_chart[0][0].level_jobtitle;
        var chart2 = [];
        for (var i = 0; i < arr_chart.length; i++) {
            for (var j = 0; j < arr_chart[i].length; j++) {
                var el = arr_chart[i][j];
                var elTopLevel = level_max - el.level_jobtitle;
                // var elLevel=level_max - el.item.level_jobtitle;
                if (!el.diff) el.diff = 1;
                for (var k = el.diff - 1; k >= 0; k--) {
                    var elLevel = elTopLevel - k;
                    if (!chart2[elLevel]) chart2[elLevel] = [];
                    var offsetIndex = 0;
                    while (offsetIndex < chart2[elLevel].length && el.offset > chart2[elLevel][offsetIndex].offset) {
                        offsetIndex++;
                    }
                    if (k == 0) {
                        if (el.diff > 1) {
                            el.firstchild = true;
                            el.lastchild = true;
                        }
                        chart2[elLevel].splice(offsetIndex, 0, el);
                    }
                    else {
                        let fakeItem: any = {
                            fake: true,
                            Name: el.Name,
                            children: el.children,
                            width: el.width,
                            offset: el.offset,
                            firstchild: true,
                            lastchild: true

                        };
                        if (k == el.diff - 1) {
                            fakeItem.firstchild = el.firstchild;
                            fakeItem.lastchild = el.lastchild;
                        }

                        chart2[elLevel].splice(offsetIndex, 0, fakeItem);
                    }

                }
            }
        }
        return chart2;
    }
    addFakeCol(arr_chart) {
        for (var i = 0; i < arr_chart.length; i++) {
            var j = 0;//vị trí mảng chạy
            var index = 0;//vị trí hiện tại	
            if (!arr_chart[i]) arr_chart[i] = [];
            while (j < arr_chart[i].length) {
                if (arr_chart[i][j].offset > index) {
                    var item_fake = {
                        offset: index,
                        children: {
                            width: arr_chart[i][j].offset - index
                        },
                        width: arr_chart[i][j].offset - index,
                        isfake: true
                    };
                    arr_chart[i].splice(j, 0, item_fake);
                    j++;
                    index = arr_chart[i][j].offset;
                }
                index += arr_chart[i][j].children.width;
                j++;
            }
        }
    }
    XemLyLich(val: any) {
        const dialogRef = this.dialog.open(LyLichNhanVienListComponent, {
            data: {
                idnv: val,
            }, panelClass: 'sky-padding-0', disableClose: false,
        });
    }
}