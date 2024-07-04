import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// Material
import { SelectionModel } from '@angular/cdk/collections';
// RXJS
import { tap } from 'rxjs/operators';
import { fromEvent, merge, BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
// Services
// Models
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SoDoToChucService } from '../Services/so-do-to-chuc.service';
import { LyLichNhanVienModel } from '../Model/so-do-to-chuc.model';


@Component({
	selector: 'm-ly-lich-nhan-vien-list',
	templateUrl: './ly-lich-nhan-vien-list.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class LyLichNhanVienListComponent implements OnInit {
	// Table fields
	// Filter fields
	//Form
	itemForm: FormGroup;
	loadingSubject = new BehaviorSubject<boolean>(false);
	loadingControl = new BehaviorSubject<boolean>(false);
	loading1$ = this.loadingSubject.asObservable();
	hasFormErrors: boolean = false;
	selectedTab: number = 0;
	hoten: string = '';
	// Selection
	ID_NV: string = '';

	//===============Khai báo value chi tiêt==================
	item: LyLichNhanVienModel;
	oldItem: LyLichNhanVienModel;
	//================Danh sách trình độ ngoại ngữ========================================
	itemTrinhDo: any;
	showBtNV: boolean = false;
	listTrinhDoNgoaiNgu: any[] = [];
	dataSource = new MatTableDataSource(this.listTrinhDoNgoaiNgu);
	displayedColumns = [];
	availableColumns = [
		{
			stt: 1,
			name: 'NgoaiNgu',
			alwaysChecked: false,
		},
		{
			stt: 2,
			name: 'Bang',
			alwaysChecked: false,
		},
		{
			stt: 3,
			name: 'GhiChu',
			alwaysChecked: false,
		},

	];
	selectedColumns = new SelectionModel<any>(true, this.availableColumns);
	selection = new SelectionModel<any>(true, []);
	//================Danh sách bằng cấp khác========================================
	listBangCapKhac: any[] = [];
	BangCapKhac = new MatTableDataSource(this.listBangCapKhac);
	displayedColumnsBCK = [];
	availableColumnsBCK = [
		{
			stt: 1,
			name: 'TenBangCap',
			alwaysChecked: false,
		},
		// {
		// 	stt: 2,
		// 	name: 'ChungChi',
		// 	alwaysChecked: false,
		// },
		{
			stt: 3,
			name: 'TenTruong',
			alwaysChecked: false,
		},
		{
			stt: 4,
			name: 'TenNganh',
			alwaysChecked: false,
		},
		{
			stt: 5,
			name: 'NamTotNghiep',
			alwaysChecked: false,
		},

	];
	selectedColumnsBCK = new SelectionModel<any>(true, this.availableColumnsBCK);
	selectionBCK = new SelectionModel<any>(true, []);
	//================Danh sách người thân========================================
	listNguoiThan: any[] = [];
	NguoiThan = new MatTableDataSource(this.listNguoiThan);
	displayedColumnsNT = [];
	availableColumnsNT = [
		{
			stt: 1,
			name: 'HoTen',
			alwaysChecked: false,
		},
		{
			stt: 2,
			name: 'QuanHe',
			alwaysChecked: false,
		},
		{
			stt: 3,
			name: 'NgaySinh',
			alwaysChecked: false,
		},
		{
			stt: 4,
			name: 'NoiO',
			alwaysChecked: false,
		},
		{
			stt: 5,
			name: 'CongViec',
			alwaysChecked: false,
		},

	];
	selectedColumnsNT = new SelectionModel<any>(true, this.availableColumnsNT);
	selectionNT = new SelectionModel<any>(true, []);
	//================Danh sách hơp đồng========================================
	listHopDong: any[] = [];
	HopDong = new MatTableDataSource(this.listHopDong);
	displayedColumnsHD = [];
	availableColumnsHD = [
		{
			stt: 1,
			name: 'SoHD',
			alwaysChecked: false,
		},
		{
			stt: 2,
			name: 'NgayKy',
			alwaysChecked: false,
		},
		{
			stt: 3,
			name: 'NgayCoHieuLuc',
			alwaysChecked: false,
		},
		{
			stt: 4,
			name: 'NgayHetHan',
			alwaysChecked: false,
		},
		{
			stt: 5,
			name: 'NguoiKy',
			alwaysChecked: false,
		},

	];
	selectedColumnsHD = new SelectionModel<any>(true, this.availableColumnsHD);
	selectionHD = new SelectionModel<any>(true, []);
	//================Danh sách trước khi vào công ty========================================
	listTruocKhiVaoCongTy: any[] = [];
	TruocKhiVaoCongTy = new MatTableDataSource(this.listTruocKhiVaoCongTy);
	displayedColumnsQTCT1 = [];
	availableColumnsQTCT1 = [
		{
			stt: 1,
			name: 'Tu',
			alwaysChecked: false,
		},
		{
			stt: 2,
			name: 'Den',
			alwaysChecked: false,
		},
		{
			stt: 3,
			name: 'CongViec',
			alwaysChecked: false,
		},
		{
			stt: 4,
			name: 'NoiLamViec',
			alwaysChecked: false,
		},
	];
	selectedColumnsQTCT1 = new SelectionModel<any>(true, this.availableColumnsQTCT1);
	selectionQTCT1 = new SelectionModel<any>(true, []);
	//================Danh sách quá trình công tác========================================
	listQuaTrinhCongTac: any[] = [];
	QuaTrinhCongTac = new MatTableDataSource(this.listQuaTrinhCongTac);
	displayedColumnsQTCT2 = [];
	availableColumnsQTCT2 = [
		{
			stt: 1,
			name: 'TuNgay',
			alwaysChecked: false,
		},
		// {
		// 	stt: 2,
		// 	name: 'DonViCongTac',
		// 	alwaysChecked: false,
		// },
		{
			stt: 3,
			name: 'Structure',
			alwaysChecked: false,
		},
		{
			stt: 4,
			name: 'ChucDanh',
			alwaysChecked: false,
		},
		{
			stt: 5,
			name: 'GhiChu',
			alwaysChecked: false,
		},
	];
	selectedColumnsQTCT2 = new SelectionModel<any>(true, this.availableColumnsQTCT2);
	selectionQTCT2 = new SelectionModel<any>(true, []);
	//================Danh sách quá trình đánh giá========================================
	listQuaTrinhDanhGia: any[] = [];
	QuaTrinhDanhGia = new MatTableDataSource(this.listQuaTrinhDanhGia);
	displayedColumnsQTDG = [];
	availableColumnsQTDG = [
		{
			stt: 1,
			name: 'Nam',
			alwaysChecked: false,
		},
		{
			stt: 2,
			name: 'TenChucDanh',
			alwaysChecked: false,
		},
		{
			stt: 3,
			name: 'TenLoai',
			alwaysChecked: false,
		},
		{
			stt: 4,
			name: 'HuongPhatTrien',
			alwaysChecked: false,
		},
		{
			stt: 5,
			name: 'SangKien',
			alwaysChecked: false,
		},
		{
			stt: 6,
			name: 'GhiChu',
			alwaysChecked: false,
		},
	];
	selectedColumnsQTDG = new SelectionModel<any>(true, this.availableColumnsQTDG);
	selectionQTDG = new SelectionModel<any>(true, []);
	//================Danh sách quá trình nghỉ dài hạn========================================
	listQuaTrinhNghiDaiHan: any[] = [];
	QuaTrinhNghiDaiHan = new MatTableDataSource(this.listQuaTrinhNghiDaiHan);
	displayedColumnsQTNDH = [];
	availableColumnsQTNDH = [
		{
			stt: 1,
			name: 'NgayXinPhep',
			alwaysChecked: false,
		},
		{
			stt: 2,
			name: 'NgayNghi',
			alwaysChecked: false,
		},
		{
			stt: 3,
			name: 'TongThoiGianNghi',
			alwaysChecked: false,
		},
		{
			stt: 4,
			name: 'LyDo',
			alwaysChecked: false,
		},
		{
			stt: 5,
			name: 'GhiChu',
			alwaysChecked: false,
		},
	];
	selectedColumnsQTNDH = new SelectionModel<any>(true, this.availableColumnsQTNDH);
	selectionQTNDH = new SelectionModel<any>(true, []);
	//================Danh sách khen thưởng========================================
	listKhenThuong: any[] = [];
	KhenThuong = new MatTableDataSource(this.listKhenThuong);
	displayedColumnsKT = [];
	availableColumnsKT = [
		{
			stt: 1,
			name: 'NgayThuong',
			alwaysChecked: false,
		},
		{
			stt: 2,
			name: 'LyDo',
			alwaysChecked: false,
		},
		{
			stt: 3,
			name: 'HinhThuc',
			alwaysChecked: false,
		},
	];
	selectedColumnsKT = new SelectionModel<any>(true, this.availableColumnsKT);
	selectionKT = new SelectionModel<any>(true, []);
	//================Danh sách kỷ luật========================================
	listKyLuat: any[] = [];
	KyLuat = new MatTableDataSource(this.listKyLuat);
	displayedColumnsKL = [];
	availableColumnsKL = [
		{
			stt: 1,
			name: 'NgayQuyetDinh',
			alwaysChecked: false,
		},
		{
			stt: 2,
			name: 'LoiViPham',
			alwaysChecked: false,
		},
		{
			stt: 3,
			name: 'HinhThucXuLy',
			alwaysChecked: false,
		},
	];
	selectedColumnsKL = new SelectionModel<any>(true, this.availableColumnsKL);
	selectionKL = new SelectionModel<any>(true, []);

	//[=======================================================]
	constructor(
		private soDoToChucService: SoDoToChucService,
		public dialogRef: MatDialogRef<LyLichNhanVienListComponent>,
		private activatedRoute: ActivatedRoute,
		public dialog: MatDialog,
		private route: ActivatedRoute,
		private itemFB: FormBuilder,
		private changeDetectorRefs: ChangeDetectorRef,
		private changeDetect: ChangeDetectorRef,
		private translate: TranslateService,
		public datepipe: DatePipe,
		@Inject(MAT_DIALOG_DATA) public data: any, ) { }

	/** LOAD DATA */
	ngOnInit() {
		this.loadingSubject.next(true);
		this.reset();

		this.applySelectedColumns();
		this.applySelectedColumnsHD();
		this.applySelectedColumnsBCK();
		this.applySelectedColumnsNT();
		this.applySelectedColumnsQTCT1();
		this.applySelectedColumnsQTCT2();
		this.applySelectedColumnsQTDG();
		this.applySelectedColumnsQTNDH();
		this.applySelectedColumnsKT();
		this.applySelectedColumnsKL();

		this.ID_NV = this.data.idnv;

		this.soDoToChucService.getItemById(+this.ID_NV).subscribe(res => {
			this.item = res;
			this.oldItem = Object.assign({}, res);
			this.initProduct();

			this.listTrinhDoNgoaiNgu = res.TrinhDoThongTin;
			this.refreshDataSource();

			this.listBangCapKhac = res.BangCapKhac;
			this.refreshDataSourceBCK();

			this.listNguoiThan = res.NguoiThan;
			this.refreshDataSourceNT();

			this.listHopDong = res.HopDong;
			this.refreshDataSourceHD();

			this.listTruocKhiVaoCongTy = res.TruocKhiVaoCty;
			this.refreshDataSourceQTCT1();

			this.listQuaTrinhCongTac = res.QuaTrinhCongTac;
			this.refreshDataSourceQTCT2();

			this.listQuaTrinhDanhGia = res.QuaTrinhDanhGia;
			this.refreshDataSourceQTDG();

			this.listQuaTrinhNghiDaiHan = res.QuaTrinhNghiDaiHan;
			this.refreshDataSourceQTNDH();

			this.listKhenThuong = res.KhenThuong;
			this.refreshDataSourceKT();

			this.listKyLuat = res.KyLuat;
			this.refreshDataSourceKL();

			this.changeDetect.detectChanges();
		});

	}

	/** ACTIONS */

	reset() {
		this.item = Object.assign({}, this.oldItem);
		this.createForm();
		this.hasFormErrors = false;
		this.itemForm.markAsPristine();
		this.itemForm.markAsUntouched();
		this.itemForm.updateValueAndValidity();
	}

	initProduct() {
		this.createForm();
		this.loadingSubject.next(false);
		this.loadingControl.next(true);
	}
	createForm() {
		this.itemForm = this.itemFB.group({
			maNV: [this.item.MaNV],
			hoTen: [this.item.HoTen],
			ngaySinh: [this.item.NgaySinh],
			gioiTinh: [this.item.GioiTinh],

			noiSinh: [this.item.NoiSinh],
			// nguyenQuan: [this.item.NguyenQuan],
			// soDienThoaiNha: [this.item.SoDienThoaiNha],
			diDong: [this.item.DiDong],

			diaChiThuongTru: [this.item.DiaChiThuongTru],
			diaChiTamTru: [this.item.DiaChiTamTru],

			emailCongTy: [this.item.EmailCongTy],
			sosoBHXH: [this.item.SosoBHXH],
			tinhTrangHonNhan: [this.item.TinhTrangHonNhan],
			maSoThue: [this.item.MaSoThue],

			cmnd: [this.item.CMND],
			ngayCapCMND: [this.item.NgayCapCMND],
			noiCapCMND: [this.item.NoiCapCMND],

			trinhDoHocVan: [this.item.TrinhDoHocVan],
			truongTotNghiep: [this.item.TruongTotNghiep],
			chuyenMon: [this.item.ChuyenMon],

			trinhDotinHoc: [this.item.TrinhDotinHoc],
			danToc: [this.item.DanToc],
			tonGiao: [this.item.TonGiao],

			structure: [this.item.Structure],
			chucDanh: [this.item.ChucDanh],

			ngayBD: [this.item.NgayBatDauLamViec],
			ngayCT: [this.item.NgayVaoChinhThuc],
			quanLy: [this.item.QuanLyHienTai],

		});
	}

	goBack() {
		this.dialogRef.close();
	}
	//---------------------------------------------------------
	/** FILTRATION */
	filterConfiguration(): any {
		const filter: any = {};
		return filter;
	}

	f_number(value: any) {
		return Number((value + '').replace(/,/g, ""));
	}

	f_currency(value: any, args?: any): any {
		let nbr = Number((value + '').replace(/,|-/g, ""));
		return (nbr + '').replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
	}
	textPres(e: any, vi: any) {
		if (isNaN(e.key)
			//&& e.keyCode != 8 // backspace
			//&& e.keyCode != 46 // delete
			&& e.keyCode != 32 // space
			&& e.keyCode != 189
			&& e.keyCode != 45
		) {// -
			e.preventDefault();
		}
	}
	checkDate(e: any, vi: any) {
		if (!((e.keyCode > 95 && e.keyCode < 106)
			|| (e.keyCode > 46 && e.keyCode < 58)
			|| e.keyCode == 8)) {
			e.preventDefault();
		}
	}
	checkValue(e: any, vi: any) {
		if (!((e.keyCode > 95 && e.keyCode < 106)
			|| (e.keyCode > 47 && e.keyCode < 58)
			|| e.keyCode == 8)) {
			e.preventDefault();
		}
	}
	f_convertDate(v: any) {
		if (v != "") {
			let a = new Date(v);
			return a.getFullYear() + "-" + ("0" + (a.getMonth() + 1)).slice(-2) + "-" + ("0" + (a.getDate())).slice(-2) + "T00:00:00.0000000";
		}
	}

	f_date(value: any, args?: any): any {
		let latest_date = this.datepipe.transform(value, 'dd/MM/yyyy');
		return latest_date;
	}
	/*=========== Xử lý load trình độ ngoại ngữ ==========*/
	refreshDataSource() {
		this.dataSource = new MatTableDataSource(this.listTrinhDoNgoaiNgu);
		this.changeDetectorRefs.detectChanges();
		this.selection.clear();
		for (var i = 0; i < this.dataSource.data.length; i++) {
			this.selection.select(this.dataSource.data[i]);
		}
		this.changeDetectorRefs.detectChanges();
	}

	applySelectedColumns() {
		const _selectedColumns: string[] = [];
		this.selectedColumns.selected.sort((a, b) => { return a.stt > b.stt ? 1 : 0; }).forEach(col => { _selectedColumns.push(col.name) });
		this.displayedColumns = _selectedColumns;
	}
	/*=========== Xử lý load hợp đồng ==========*/
	refreshDataSourceHD() {
		this.HopDong = new MatTableDataSource(this.listHopDong);
		this.changeDetectorRefs.detectChanges();
		this.selectionHD.clear();
		for (var i = 0; i < this.HopDong.data.length; i++) {
			this.selectionHD.select(this.HopDong.data[i]);
		}
		this.changeDetectorRefs.detectChanges();
	}

	applySelectedColumnsHD() {
		const _selectedColumns: string[] = [];
		this.selectedColumnsHD.selected.sort((a, b) => { return a.stt > b.stt ? 1 : 0; }).forEach(col => { _selectedColumns.push(col.name) });
		this.displayedColumnsHD = _selectedColumns;
	}
	/*=========== Xử lý load bằng cấp khác ==========*/
	refreshDataSourceBCK() {
		this.BangCapKhac = new MatTableDataSource(this.listBangCapKhac);
		this.changeDetectorRefs.detectChanges();
		this.selectionBCK.clear();
		for (var i = 0; i < this.BangCapKhac.data.length; i++) {
			this.selectionBCK.select(this.BangCapKhac.data[i]);
		}
		this.changeDetectorRefs.detectChanges();
	}

	applySelectedColumnsBCK() {
		const _selectedColumns: string[] = [];
		this.selectedColumnsBCK.selected.sort((a, b) => { return a.stt > b.stt ? 1 : 0; }).forEach(col => { _selectedColumns.push(col.name) });
		this.displayedColumnsBCK = _selectedColumns;
	}
	/*=========== Xử lý load người thân ==========*/
	refreshDataSourceNT() {
		this.NguoiThan = new MatTableDataSource(this.listNguoiThan);
		this.changeDetectorRefs.detectChanges();
		this.selectionNT.clear();
		for (var i = 0; i < this.NguoiThan.data.length; i++) {
			this.selectionNT.select(this.NguoiThan.data[i]);
		}
		this.changeDetectorRefs.detectChanges();
	}

	applySelectedColumnsNT() {
		const _selectedColumns: string[] = [];
		this.selectedColumnsNT.selected.sort((a, b) => { return a.stt > b.stt ? 1 : 0; }).forEach(col => { _selectedColumns.push(col.name) });
		this.displayedColumnsNT = _selectedColumns;
	}
	/*=========== Xử lý load trước khi vào công ty ==========*/
	refreshDataSourceQTCT1() {
		this.TruocKhiVaoCongTy = new MatTableDataSource(this.listTruocKhiVaoCongTy);
		this.changeDetectorRefs.detectChanges();
		this.selectionQTCT1.clear();
		for (var i = 0; i < this.TruocKhiVaoCongTy.data.length; i++) {
			this.selectionQTCT1.select(this.TruocKhiVaoCongTy.data[i]);
		}
		this.changeDetectorRefs.detectChanges();
	}

	applySelectedColumnsQTCT1() {
		const _selectedColumns: string[] = [];
		this.selectedColumnsQTCT1.selected.sort((a, b) => { return a.stt > b.stt ? 1 : 0; }).forEach(col => { _selectedColumns.push(col.name) });
		this.displayedColumnsQTCT1 = _selectedColumns;
	}
	/*=========== Xử lý load quá trình công tác ==========*/
	refreshDataSourceQTCT2() {
		this.QuaTrinhCongTac = new MatTableDataSource(this.listQuaTrinhCongTac);
		this.changeDetectorRefs.detectChanges();
		this.selectionQTCT2.clear();
		for (var i = 0; i < this.QuaTrinhCongTac.data.length; i++) {
			this.selectionQTCT1.select(this.QuaTrinhCongTac.data[i]);
		}
		this.changeDetectorRefs.detectChanges();
	}

	applySelectedColumnsQTCT2() {
		const _selectedColumns: string[] = [];
		this.selectedColumnsQTCT2.selected.sort((a, b) => { return a.stt > b.stt ? 1 : 0; }).forEach(col => { _selectedColumns.push(col.name) });
		this.displayedColumnsQTCT2 = _selectedColumns;
	}
	/*=========== Xử lý load quá trình đánh giá ==========*/
	refreshDataSourceQTDG() {
		this.QuaTrinhDanhGia = new MatTableDataSource(this.listQuaTrinhDanhGia);
		this.changeDetectorRefs.detectChanges();
		this.selectionQTDG.clear();
		for (var i = 0; i < this.QuaTrinhDanhGia.data.length; i++) {
			this.selectionQTCT1.select(this.QuaTrinhDanhGia.data[i]);
		}
		this.changeDetectorRefs.detectChanges();
	}

	applySelectedColumnsQTDG() {
		const _selectedColumns: string[] = [];
		this.selectedColumnsQTDG.selected.sort((a, b) => { return a.stt > b.stt ? 1 : 0; }).forEach(col => { _selectedColumns.push(col.name) });
		this.displayedColumnsQTDG = _selectedColumns;
	}
	/*=========== Xử lý load quá trình nghỉ dài hạn ==========*/
	refreshDataSourceQTNDH() {
		this.QuaTrinhNghiDaiHan = new MatTableDataSource(this.listQuaTrinhNghiDaiHan);
		this.changeDetectorRefs.detectChanges();
		this.selectionQTNDH.clear();
		for (var i = 0; i < this.QuaTrinhNghiDaiHan.data.length; i++) {
			this.selectionQTNDH.select(this.QuaTrinhNghiDaiHan.data[i]);
		}
		this.changeDetectorRefs.detectChanges();
	}

	applySelectedColumnsQTNDH() {
		const _selectedColumns: string[] = [];
		this.selectedColumnsQTNDH.selected.sort((a, b) => { return a.stt > b.stt ? 1 : 0; }).forEach(col => { _selectedColumns.push(col.name) });
		this.displayedColumnsQTNDH = _selectedColumns;
	}
	/*=========== Xử lý load khen thưởng ==========*/
	refreshDataSourceKT() {
		this.KhenThuong = new MatTableDataSource(this.listKhenThuong);
		this.changeDetectorRefs.detectChanges();
		this.selectionKT.clear();
		for (var i = 0; i < this.KhenThuong.data.length; i++) {
			this.selectionKT.select(this.KhenThuong.data[i]);
		}
		this.changeDetectorRefs.detectChanges();
	}

	applySelectedColumnsKT() {
		const _selectedColumns: string[] = [];
		this.selectedColumnsKT.selected.sort((a, b) => { return a.stt > b.stt ? 1 : 0; }).forEach(col => { _selectedColumns.push(col.name) });
		this.displayedColumnsKT = _selectedColumns;
	}
	/*=========== Xử lý load kỷ luật ==========*/
	refreshDataSourceKL() {
		this.KyLuat = new MatTableDataSource(this.listKyLuat);
		this.changeDetectorRefs.detectChanges();
		this.selectionKL.clear();
		for (var i = 0; i < this.KyLuat.data.length; i++) {
			this.selectionKL.select(this.KyLuat.data[i]);
		}
		this.changeDetectorRefs.detectChanges();
	}

	applySelectedColumnsKL() {
		const _selectedColumns: string[] = [];
		this.selectedColumnsKL.selected.sort((a, b) => { return a.stt > b.stt ? 1 : 0; }).forEach(col => { _selectedColumns.push(col.name) });
		this.displayedColumnsKL = _selectedColumns;
	}
	//=========Xuất file hợp đồng
	xuatFile() {
		this.soDoToChucService.ExportExcel(+this.ID_NV).subscribe(response => {
			var headers = response.headers;
			let filename = headers.get('x-filename');
			let type = headers.get('content-type');
			let blob = new Blob([response.body], { type: type });
			const fileURL = URL.createObjectURL(blob);
			var link = document.createElement('a');
			link.href = fileURL;
			link.download = filename;
			link.click();
		});
	}

}
