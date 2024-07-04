import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, Inject, Input, OnDestroy, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Material
import { SelectionModel } from '@angular/cdk/collections';
// RXJS
import { BehaviorSubject, fromEvent, merge, Observable, of, ReplaySubject, Subject, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ProcessWorkDataSource } from '../Model/data-sources/process-work.datasource';
import { NodeProcessModel, ProcessWorkModel, ToDoDataModel } from '../Model/process-work.model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { catchError, finalize, share, takeUntil, tap } from 'rxjs/operators';
import { JeeChooseMemberComponent } from '../../component/jee-choose-member/jee-choose-member.component';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { DynamicFormService } from '../../component/dynamic-form/dynamic-form.service';
import { JeeWorkStore } from '../store/auxiliary-router-jw.store';
import { DiagramComponent, DiagramTools, ConnectorModel, NodeModel, Diagram, BpmnDiagrams, IDraggingEventArgs, Rect, SnapSettingsModel, SnapConstraints, NodeConstraints } from '@syncfusion/ej2-angular-diagrams';
import { CongViecDialogComponent } from '../cong-viec-dialog/cong-viec-dialog.component';
import { CongViecChiTietDialogComponent } from '../cong-viec-chi-tiet-dialog/cong-viec-chi-tiet-dialog.component';
import { PageWorkDetailStore } from '../../page-work-detail.store';
import * as moment from 'moment';
import { ProcessWorkService } from '../../../services/process-work.service';
import { DanhMucChungService } from '../../../services/danhmuc.service';
import { LayoutUtilsService, MessageType } from 'projects/jeeworkflow/src/modules/crud/utils/layout-utils.service';
import { DialogDecision } from '../../component/dialog-decision/dialog-decision.component';
import { ProcessWorkEditComponent } from '../../component/process-work-edit/process-work-edit.component';
import { QueryParamsModelNew } from '../../../models/query-models/query-params.model';
import { TemplateCenterComponent } from '../../component/jeework/template-center/template-center.component';
import { environment } from 'projects/jeeworkflow/src/environments/environment';
import { HttpUtilsService } from 'projects/jeeworkflow/src/modules/crud/utils/http-utils.service';
Diagram.Inject(BpmnDiagrams);


export interface NavItem {
	displayName: string;
	iconName: string;
	route?: string;
	children?: NavItem[];
}

@Component({
	selector: 'kt-process-work-details',
	templateUrl: './process-work-details.component.html',
	styleUrls: ['./process-work-details.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})


export class ProcessWorkDetailsComponent implements OnInit {
	// Table fields
	viewLoading: boolean = false;
	dataSource: ProcessWorkDataSource;
	displayedColumns = ['ProcessWorkName', 'ProcessWorkType', 'ModifiedBy', 'LastModified', 'actions'];
	// @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	// @ViewChild(MatSort, { static: true }) sort: MatSort;
	// Filter fields
	listchucdanh: any[] = [];
	// Selection
	selection = new SelectionModel<ProcessWorkModel>(true, []);
	productsResult: ProcessWorkModel[] = [];

	WorkID: number;
	listNodes: any[] = [];
	listConnectors: any[] = [];
	@ViewChild('diagram', { static: false })
	public diagram: DiagramComponent;
	disabledBtn: boolean = false;
	//====================Thông tin quy trình======================
	ShowQT: boolean = true;
	ShowDone: any;
	itemQT: any;
	ID_QuyTrinh: number;
	TenQuyTrinh: string = '';
	TenNhiemVu: string = '';
	//====================Thông tin giai đoạn======================
	ShowGD: boolean = false;
	itemGD: any;
	TimeNow: Date;
	DatField: any[] = [];
	DataToDo: any[] = [];
	ShowData: number = 1;
	GiaiDoanID: number;
	GiaiDoan: string;
	ShowCVDetails: boolean = false;
	GiaiDoanQTC: number;

	//==================Sử dụng comment=======================================
	// topicObjectID: string;
	private readonly onDestroy = new Subject<void>();

	public removeEventListener: () => void;
	public anchors;

	//=====================================================================
	UserCurrent_lib: string = '';
	topicObjectID$: BehaviorSubject<string> = new BehaviorSubject<string>("");

	constructor(public processWorkService: ProcessWorkService,
		public danhMucService: DanhMucChungService,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private activatedRoute: ActivatedRoute,
		private changeDetectorRefs: ChangeDetectorRef,
		private router: Router,
		public dynamicFormService: DynamicFormService,
		public jeeWorkStore: JeeWorkStore,
		public pageWorkDetailStore: PageWorkDetailStore,
		private elementRef: ElementRef,
		private renderer: Renderer2,
		private httpUtils: HttpUtilsService,
	) { 
		this.UserCurrent_lib = this.httpUtils.getUsername();
	}


	/** LOAD DATA */
	ngOnInit() {
		this.removeEventListener = this.renderer.listen(this.elementRef.nativeElement, 'click', (event) => {
			if (event.target instanceof HTMLAnchorElement) {
				this.handleAnchorClick(event);
			}
		});
		const roles: any = JSON.parse(localStorage.getItem('appCode'));
		this.listAppCode = roles;
		this.CheckJeeWork();
		this.TimeNow = new Date();
		this.activatedRoute.params.subscribe(params => {
			this.WorkID = +params.id;
			this.InitComment("kt-process-work-details" + this.WorkID);
			this.danhMucService.getInfoProcessName(this.WorkID).subscribe(res => {
				if (res && res.status == 1) {
					this.ID_QuyTrinh = res.data[0].ProcessID;
					this.TenQuyTrinh = res.data[0].ProcessName;
					this.changeDetectorRefs.detectChanges();
				}
			})
			this.LoadChiTietQuyTrinh();
		});
		this.documentClick.bind(this);
		const sb = this.jeeWorkStore.updateEvent$.subscribe(res => {
			if (res) {
				this.LoadNodeDetails();
				this.changeDetectorRefs.detectChanges();
			}
		})
		const dark_mode = this.pageWorkDetailStore.themeupdateEvent$.subscribe(res => {
			if (res) {
				// this.getNodeDefaults();
				// this.getConnectorDefaults();
				this.LoadChiTietQuyTrinh();
				this.pageWorkDetailStore.themeupdateEvent = false;
				this.changeDetectorRefs.detectChanges();
			}
		})
		this.snapSettings = {
			// horizontalGridlines: { lineColor: 'red', lineDashArray: '1,1' },
			// verticalGridlines: { lineColor: 'red', lineDashArray: '1,1' },
			constraints: SnapConstraints.None,
		}
	}
	public snapSettings: SnapSettingsModel;
	InitComment(id: string) {
		this.topicObjectID$.next("");
		this.processWorkService.getTopicObjectIDByComponentName(id).pipe(
			tap((res) => {
				this.topicObjectID$.next(res);
				// this.CountComment();
				this.changeDetectorRefs.detectChanges();
			}),
			catchError(err => {
				console.log(err);
				return of();
			}),
			finalize(() => { }),
			share(),
			takeUntil(this.onDestroy),
		).subscribe();
	}

	public ngOnDestroy() {
		this.onDestroy.next();
		if (this.anchors) {
			this.anchors.forEach((anchor: HTMLAnchorElement) => {
				anchor.removeEventListener('click', this.handleAnchorClick)
			})
		}
	}

	public handleAnchorClick = (event: Event) => {
		event.preventDefault();
		const anchor = event.target as HTMLAnchorElement;
		let item = {
			filename: anchor.innerText,
			link: anchor.href,
			strBase64: anchor.id,
		};
		this.downFile(item);
	}
	//item.status == '3' ? '#b9f3beb8' : item.status == '-1' ? '#efb5b5db' : item.status == '0' ? '#f64e60' : item.status == '1' ? '#5867dd' : item.status == '2' ? '#9acd32' : (item.status == null && item.assignDate != null) ? '#ffb822'
	//=================================Load thông tin trên diagram==========================
	LoadData() {
		this.processWorkService.Get_NodeProcess(this.WorkID).subscribe(res => {
			if (res.status == 1) {
				if (res.notelist.length > 0) {
					this.listNodes = res.notelist;
				} else {
					this.listNodes = [];
				}
				if (res.relationshiplist.length > 0) {
					this.listConnectors = res.relationshiplist;
				} else {
					this.listConnectors = [];
				}
				this.XuLyData();
			} else {
				this.goBack();
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			}
		})
	};

	XuLyData() {
		let dataNodes = [];
		if (this.listNodes.length > 0) {
			this.listNodes.map((item, index) => {
				let dt_port = [];
				item.portlist.map((item, index) => {
					let item_port = {
						id: item.id,
						offset: { x: item.toadox, y: item.toadoy },
						visibility: 1,
						style: document.getElementsByClassName("light-mode").length > 0 ? { fill: 'white', strokeColor: '#d9d9d9' } : { fill: '#212e48', strokeColor: '' }
					}
					dt_port.push(item_port);
				})
				let dt = {
					id: 'N' + item.id,
					offsetX: item.offsetX,
					offsetY: item.offsetY,
					width: item.width,
					height: item.height,
					rotateAngle: item.rotateAngle,
					style: document.getElementsByClassName("light-mode").length > 0 ?
						{
							fill: item.status == '3' ? '#b9f3beb8' : item.status == '-1' ? '#efb5b5db' : item.status == '0' ? '#f64e60' : item.status == '1' ? '#e87304' : item.status == '2' ? '#b9f3beb8' : (item.status == null && item.assignDate != null) ? 'gray' : 'white',
							strokeColor: '#a0a0a0'
						}
						: {
							fill: item.status == '3' ? '#1C3238' : item.status == '-1' ? '#3A2434' : item.status == '0' ? '#F64E60' : item.status == '1' ? '#392f28' : item.status == '2' ? '#1c3238' : (item.status == null && item.assignDate != null) ? 'gray' : '#212e48',
							strokeColor: 'rgba(54,153,255,.5)'
						},
					shape: { type: item.shape == 'Ellipse' || item.shape == 'Plus' ? 'Basic' : item.shape == 'Message' ? 'Bpmn' : 'Flow', shape: item.shape },
					annotations: document.getElementsByClassName("light-mode").length > 0 ?
						[{ content: item.title, style: { color: item.status == '3' ? '#0A9562' : item.status == '-1' ? '#F86252' : item.status == '1' ? 'white' : item.status == '2' ? '#0A9562' : 'black', fill: 'transparent' } }] :
						[{ content: item.title, style: { color: item.status == '3' ? '#0BB783' : item.status == '-1' ? '#F64E60' : item.status == '1' ? '#ffc700' : item.status == '2' ? '#0BB783' : '#cdcdcd', fill: 'transparent' } }],
					ports: dt_port,
					nextprocessid: item.nextprocessid,
				};
				dataNodes.push(dt);
			})
			this.diagram.nodes = dataNodes;
		} else {
			this.diagram.nodes = dataNodes;
		}

		let dataConnect = [];
		if (this.listConnectors.length > 0) {
			this.listConnectors.map((item, index) => {
				let dt = {
					id: item.id,
					sourceID: 'N' + item.sourceID,
					targetID: 'N' + item.targetID,
					type: item.type,
					annotations: [{ content: item.title }],
					sourcePortID: item.sourcePortID,
					targetPortID: item.targetPortID,
					sourcePoint: { x: +item.sourcePointX, y: +item.sourcePointY },
					targetPoint: { x: +item.targetPointX, y: +item.targetPointY },
					constraints: this.diagram.nodeDefaults != (this.diagram.dragSourceEnd || this.diagram.dragTargetEnd),
					style: document.getElementsByClassName("light-mode").length > 0 ? { strokeColor: '#a0a0a0', strokeWidth: 2 } :
						{ strokeColor: 'rgba(54,153,255,.5)', strokeWidth: 2 },
					targetDecorator: document.getElementsByClassName("light-mode").length > 0 ? { style: { fill: '#a0a0a0', strokeColor: '#a0a0a0' } } :
						{ style: { fill: 'rgba(54,153,255,.5)', strokeColor: 'rgba(54,153,255,.5)' } },
				};
				dataConnect.push(dt);
			})
			this.diagram.connectors = dataConnect;
		} else {
			this.diagram.connectors = dataConnect;
		}

		this.diagram.commandManager = {
			commands: [{
				name: 'Delete',
				canExecute: function (args) {
					if (args.model.selectedItems.children.length > 0) {
						return true;
					}
				},
				execute: function (args) {
					// do your custom actions
				},
				gesture: {
					key: 46,
				}
			}, {
				name: 'X',
				canExecute: function (args) {
					if (args.model.selectedItems.children.length > 0) {
						return true;
					}
				},
				execute: function (args) {
					// do your custom actions
				},
				gesture: {
					key: 88,
					keyModifiers: 1
				}
			}, {
				name: 'V',
				canExecute: function (args) {
					if (args.model.selectedItems.children.length > 0) {
						return true;
					}
				},
				execute: function (args) {
					// do your custom actions
				},
				gesture: {
					key: 86,
					keyModifiers: 1
				}
			}]
		}

		document.getElementById("diagramcontent").style.overflow = "scroll";
	}

	public documentClick(args: MouseEvent): void {
		let target: HTMLElement = args.target as HTMLElement;
		// custom code start
		let selectedElement: HTMLCollection = document.getElementsByClassName('e-selected-style');
		if ((selectedElement.length && target.id !== '' && target.id !== 'checked') || target.className == "mat-checkbox-inner-container mat-checkbox-inner-container-no-side-margin") {
			selectedElement[0].classList.remove('e-selected-style');
		}
		// custom code end
		let drawingObject: NodeModel | ConnectorModel = null;
		if (target.className === 'image-pattern-style') {
			switch (target.id) {
				case 'shape0':
					// drawingObject = { shape: { type: 'Basic', shape: 'Ellipse' } };
					drawingObject = null;
					break;
				case 'shape1':
					drawingObject = { shape: { type: 'Flow', shape: 'Terminator' } };
					break;
				case 'shape2':
					drawingObject = { shape: { type: 'Flow', shape: 'Process' } };
					break;
				case 'shape3':
					drawingObject = { shape: { type: 'Flow', shape: 'Decision' } };
					break;
				case 'shape4':
					drawingObject = { shape: { type: 'Flow', shape: 'SummingJunction' } };
					break;
				case 'shape5':
					drawingObject = { shape: { type: 'Flow', shape: 'PreDefinedProcess' } };
					break;
				case 'shape6':
					drawingObject = { shape: { type: 'Basic', shape: 'Plus' } };
					break;
				case 'shape7':
					drawingObject = { shape: { type: 'Bpmn', shape: 'Message' } };
					break;
				case 'text':
					drawingObject = { shape: { type: 'Text' } };
					break;
				case 'straight':
					drawingObject = { type: 'Straight' };
					break;
				case 'ortho':
					drawingObject = { type: 'Orthogonal' };
					break;
				case 'cubic':
					drawingObject = { type: 'Bezier' };
					break;
			}
			if (drawingObject) {
				this.diagram.drawingObject = drawingObject;
				this.diagram.tool = DiagramTools.ContinuousDraw;
				this.diagram.dataBind();
				target.classList.add('e-selected-style');
			}
		}
	};

	public getNodeDefaults(): NodeModel {
		let obj: NodeModel = {};
		if (document.getElementsByClassName("light-mode").length > 0) {
			// obj.style = { fill: 'white', strokeColor: 'black' };
			obj.annotations = [{ style: { color: 'black', fill: 'transparent' } }];
		} else {
			// obj.style = { fill: 'black', strokeColor: 'white' };
			obj.annotations = [{ style: { color: 'white', fill: 'transparent' } }];
		}
		return obj;
	}

	public getConnectorDefaults(): ConnectorModel {
		let obj: ConnectorModel = {};
		if (document.getElementsByClassName("light-mode").length > 0) {
			obj.style = { strokeColor: 'black', strokeWidth: 2 };
			obj.targetDecorator = { style: { fill: 'black' } };
		} else {
			obj.style = { strokeColor: '#323248', fill: 'red', strokeWidth: 2 };
			obj.targetDecorator = { style: { fill: '#323248' } };
		}

		return obj;
	}

	getHeight(): any {
		let tmp_height = 0;
		tmp_height = window.innerHeight - 200;
		return tmp_height + 'px';
	}
	getWidth() {
		let tmp_width = 0;
		tmp_width = document.getElementById("width-diagram").clientWidth;
		return tmp_width + "px";
	}
	getHeightTQ(): any {
		let tmp_height = 0;
		if (this.ShowDone != null) {
			tmp_height = window.innerHeight - 310;
		} else {
			tmp_height = window.innerHeight - 210;
		}
		return tmp_height + 'px';
	}
	getHeightHD(): any {
		let tmp_height = 0;
		tmp_height = window.innerHeight - 210;
		return tmp_height + 'px';
	}
	getHeightCVLK(): any {
		let tmp_height = 0;
		if (this.ShowDone != null) {
			tmp_height = window.innerHeight - 535;
		} else {
			tmp_height = window.innerHeight - 435;
		}
		return tmp_height + 'px';
	}
	//==================================Load thông tin chi tiết quy trình===================
	LoadChiTietQuyTrinh() {
		this.processWorkService.Get_ProcessDetail(this.WorkID).subscribe(res => {
			if (res.status == 1) {
				this.itemQT = res.data;
				this.ShowDone = res.data.IsDone;
				this.TenNhiemVu = res.data.TaskName;
				if (this.itemQT.TyLe != "" && this.itemQT.TyLe != null) {
					this.TyLe = this.itemQT.TyLe;
				}
				this.ShowDiagram = true;
				this.NodeRoot = res.data.NodeRoot;
				this.changeDetectorRefs.detectChanges();
				this.LoadData();
			} else {
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			}
		})
	}

	ChiTietNode(val) {
		if (val.name == "click") {
			if (val.element.shape != undefined) {
				if (val.element.shape.type == "Flow" || (val.element.shape.type == "Basic" && val.element.shape.shape != "Ellipse") || val.element.shape.type == "Bpmn") {
					this.GiaiDoanID = val.element.id.substring(1);
					this.GiaiDoan = val.element.shape.shape;

					this.GiaiDoanQTC = val.element.nextprocessid;
					this.ShowData = 1;
					this.layoutUtilsService.showWaitingDiv();
					this.processWorkService.Get_NodeDetail(val.element.id.substring(1)).subscribe(res => {
						this.layoutUtilsService.OffWaitingDiv();
						if (res.status == 1) {
							this.ShowQT = false;
							this.ShowGD = true;
							this.itemGD = res.data;
							this.DatField = res.data.DataFields;
							this.DataToDo = res.data.DataToDo;
							this.ID_Project_GD = 0;
							this.selectedTabGD = 0;
							if (this.GiaiDoan == "Decision") {
								this.ContentStr = res.data.ContentStr;
								if (res.data && res.data.DataFields.length > 0) {
									res.data.DataFields.forEach(ele => {
										if (ele.ControlID == 10 || ele.ControlID == 12 || ele.ControlID == 13 || ele.ControlID == 14) {
											let replace = "";
											if (ele.Value.length > 0) {
												ele.Value.forEach(e => {
													replace += '<a style="cursor: pointer; padding-right: 10px;" href="' + e.link + '"' + ' id="' + e.strBase64 + '">' + e.filename + '</a >'
												})
											}
											if (replace != "") {
												this.ContentStr = this.ContentStr.replace('$' + ele.keyword + '$', replace);
											} else {
												this.ContentStr = this.ContentStr.replace('$' + ele.keyword + '$', '<a>' + ele.Title + '</a >')
											}
										}
									});
								}
								this.ListKetQua = res.data.stage_result;
							}
							this.ThongTinLienQuan = this.itemGD.ThongTinLienQuan;
							res.data.DataFields.forEach(ele => {
								if (ele.ControlID == 10 || ele.ControlID == 12 || ele.ControlID == 13 || ele.ControlID == 14) {
									let replace = "";
									if (ele.Value.length > 0) {
										ele.Value.forEach(e => {
											replace += '<a style="cursor: pointer; padding-right: 10px;" href="' + e.link + '"' + ' id="' + e.strBase64 + '">' + e.filename + '</a >'
										})
									}
									if (replace != "") {
										this.ThongTinLienQuan = this.ThongTinLienQuan.replace('$' + ele.keyword + '$', replace);
									} else {
										this.ThongTinLienQuan = this.ThongTinLienQuan.replace('$' + ele.keyword + '$', '<a>' + ele.Title + '</a >')
									}
								}
							});
							this.changeDetectorRefs.detectChanges();
						} else {
							this.ShowGD = false;
							this.ShowQT = true;
							this.changeDetectorRefs.detectChanges();
						}
					})
				} else {
					this.ShowQT = true;
					this.changeDetectorRefs.detectChanges();
				}
			} else {
				this.ShowGD = false;
				this.ShowQT = true;
				this.changeDetectorRefs.detectChanges();
			}
		}
	}

	goBackView() {
		this.ShowGD = false;
		this.ShowQT = true;
		this.changeDetectorRefs.detectChanges();
	}

	//======================================================================================
	goBack() {
		let _backUrl = `/Workflow/NhiemVu`;
		this.router.navigateByUrl(_backUrl);
	}
	//===============================================Tab công việc chi tiêt===============================

	AddCongViec() {
		const toDoDataModel = new ToDoDataModel();
		toDoDataModel.clear(); // Set all defaults fields
		this.UpdateCongViec(toDoDataModel);
	}

	UpdateCongViec(_item: ToDoDataModel) {
		let saveMessageTranslateParam = '';
		saveMessageTranslateParam += _item.RowID > 0 ? 'landingpagekey.capnhatthanhcong' : 'landingpagekey.themthanhcong';
		const _saveMessage = this.translate.instant(saveMessageTranslateParam);
		const _messageType = _item.RowID > 0 ? MessageType.Update : MessageType.Create;
		const dialogRef = this.dialog.open(CongViecChiTietDialogComponent, { data: { _item, _NodeID: this.GiaiDoanID }, panelClass: ['sky-padding-0', 'width700'], });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				this.LoadNodeDetails();
			}
			else {
				this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 4000, true, false);
				this.LoadNodeDetails();
			}
		});
	}

	/** Delete */
	Delete(_item: ToDoDataModel) {
		const _title = this.translate.instant('landingpagekey.xoa');
		const _description = this.translate.instant('landingpagekey.bancochacchanmuonxoakhong');
		const _waitDesciption = this.translate.instant('landingpagekey.dulieudangduocxoa');
		const _deleteMessage = this.translate.instant('landingpagekey.xoathanhcong');

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.processWorkService.delToDo(_item.RowID).subscribe(res => {
				if (res && res.status === 1) {
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete, 4000, true, false, 3000, 'top', 1);
				}
				else {
					this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
				}
				this.LoadNodeDetails();
			});
		});
	}

	LoadNodeDetails() {
		this.layoutUtilsService.showWaitingDiv();
		this.processWorkService.Get_NodeDetail(this.GiaiDoanID).subscribe(res => {
			this.layoutUtilsService.OffWaitingDiv();
			if (res.status == 1) {
				this.ShowQT = false;
				this.ShowGD = true;
				this.itemGD = res.data;
				this.DatField = res.data.DataFields;
				this.DataToDo = res.data.DataToDo;
				this.ID_Project_GD = this.itemGD.listid;
				this.changeDetectorRefs.detectChanges();
			} else {
				this.ShowGD = false;
				this.changeDetectorRefs.detectChanges();
			}
		})
	}

	DrawPie(item: any) {
		if (item.IsQuaHan) {
			return 'conic-gradient(rgb(175, 15, 15) ' + 100 + '%, #d1cbcb 0)';
		} else {
			if (item.Status == 1) {
				return 'conic-gradient(#ffb822 ' + 100 + '%, #d1cbcb 0)';
			} else if (item.Status == 2) {
				return 'conic-gradient(#9acd32 ' + 100 + '%, #d1cbcb 0)';
			} else if (item.Status == 0) {
				return 'conic-gradient(#f64e60 ' + 100 + '%, #d1cbcb 0)';
			} else {
				return 'conic-gradient(#808080 ' + 100 + '%, #d1cbcb 0)';
			}
		}
	}

	CapNhatCongViec(val, data) {
		const _title = this.translate.instant('workprocess.capnhatcongviec');
		let _description: any;
		if (val == 0) {
			_description = this.translate.instant('workprocess.bancochacchanmuontamdungcongviec');
		}
		if (val == 1) {
			_description = this.translate.instant('workprocess.bancochacchanmuonthuchiencongviec');
		}
		if (val == 2) {
			_description = this.translate.instant('workprocess.bancochacchanmuonhoanthanhcongviec');
		}
		const _waitDesciption = this.translate.instant('workprocess.dulieudangduocxyly');

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			let item = {
				ID: +data.RowID,
				Status: +val,
			}
			this.processWorkService.updateStatusToDo(item).subscribe(res => {
				if (res && res.status == 1) {
					this.LoadNodeDetails();
				} else {
					this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
				}
			});
		});

	}

	ViewDetai(item) {
		if (item.IsEditStatus) {
			this.jeeWorkStore.updateEvent = false;
			this.router.navigate(['', { outlets: { auxName: 'auxJW/detailJeeWF/' + item.RowID }, }]);
		}
	}

	AddNguoiThucHien(item) {
		let _item = [];
		item.Data_Implementer.map((it, index) => {
			_item.push('' + it.ObjectID);
		});
		const dialogRef = this.dialog.open(JeeChooseMemberComponent, { data: { _item }, panelClass: ['sky-padding-0', 'width600'], });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			let data_nguoithuchien = [];
			res.data.map((item, index) => {
				data_nguoithuchien.push(item.UserId);
			})

			let _data = {
				ID: item.RowID,/// 1: id node; 2: id todo; 3: id process 
				Type: 1,  /// 1: người thực hiện, 2: người theo dõi (quy trình); 3: người theo dõi (công việc chi tiết) 
				WorkType: 2,  /// 1: công việc; 2: công việc chi tiết; 3: quy trình
				NVIDList: data_nguoithuchien
			}
			this.LuuNguoiThucHienCongViec(_data);

			this.changeDetectorRefs.detectChanges();
		});
	}

	LuuNguoiThucHienCongViec(_item: any) {
		this.processWorkService.updateImplementer(_item).subscribe(res => {
			if (res && res.status == 1) {
				this.LoadNodeDetails();
			} else {
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			}
		});
	}
	//======================================Chuyển giai đoạn================================
	ChuyenGiaiDoan() {
		if (this.GiaiDoan == "Decision") {
			this.processWorkService.Get_FieldsNode(this.GiaiDoanID, 0).subscribe(res => {
				if (res && res.status == 1) {
					if (res.KetQua.length > 0) {
						const dialogRef = this.dialog.open(DialogDecision, {
							data: { data: res.KetQua, _type: 0, _contentStr: res.ContentStr }, panelClass: ['sky-padding-0', 'width600'],

						});
						dialogRef.afterClosed().subscribe(res => {
							if (!res) {
								return;
							}
							else {
								this.loadDynamic(res._item, 0, true);
							}
						});
					}
				} else {
					this.ChinhSuaGiaiDoanNhiemVu();
					this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
				}
			})
		} else {
			this.processWorkService.Get_FieldsNode(this.GiaiDoanID, 0).subscribe(res => {
				if (res.status == 1) {
					if (res.data.length > 0) {
						this.loadDynamic(this.GiaiDoanID, 0, true);
					} else {
						this.ngOnInit();
					}
				}
				if (res.status == -1)
					this.ChinhSuaGiaiDoanNhiemVu();
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			})
		}
	}

	ChinhSuaGiaiDoanNhiemVu() {
		this.processWorkService.Get_NodeDetail(this.GiaiDoanID).subscribe(res => {
			if (res.status == 1) {
				if (res.data.DataFields.length > 0) {
					let isFlag = false;
					res.data.DataFields.map((item, index) => {
						if (item.IsFieldNode) {
							isFlag = true;
						}
					})
					if (isFlag) {
						const dialogRef = this.dialog.open(DialogDecision, { data: { _item: {}, _type: 13, _DatField: res.data.DataFields }, panelClass: ['sky-padding-0', 'width600'], });
						dialogRef.afterClosed().subscribe(res => {
							if (!res) {
								return;
							}
							this.ChuyenGiaiDoan();
						});
					} else {
						this.layoutUtilsService.showActionNotification("Không có dữ liệu", MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
					}
				} else {
					this.layoutUtilsService.showActionNotification("Không có dữ liệu", MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
				}

				this.changeDetectorRefs.detectChanges();
			} else {
				this.changeDetectorRefs.detectChanges();
			}
		})
	}

	loadDynamic(val: any, NodeListID: number, IsNext: boolean) {
		let saveMessageTranslateParam = '';
		saveMessageTranslateParam = 'landingpagekey.thanhcong';
		const _saveMessage = this.translate.instant(saveMessageTranslateParam);
		const _messageType = MessageType.Create;
		const dialogRef = this.dialog.open(ProcessWorkEditComponent, { data: { _val: val, _type: 1, _NodeListID: NodeListID, _IsNext: IsNext } });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			else {
				this.ngOnInit();
				this.ShowGD = false;
				this.ShowQT = true;
				this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 4000, true, false);
			}
		});
	}

	//=============================Nút giao việc (Không có người thực hiện)===============================
	GiaoViec() {
		let saveMessageTranslateParam = '';
		saveMessageTranslateParam = 'landingpagekey.capnhatthanhcong';
		const _saveMessage = this.translate.instant(saveMessageTranslateParam);
		const _messageType = MessageType.Create;
		const dialogRef = this.dialog.open(DialogDecision, {
			data: { _type: 1, _GiaiDoanID: this.GiaiDoanID, _DataThucHien: this.itemGD.NguoiThucHien }, panelClass: ['sky-padding-0', 'width600'],

		});
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 4000, true, false);
			this.LoadNodeDetails();
		});
	}

	//=============================================Chi tiết quy trình con=============================
	ChiTietQuyTrinh(item) {

	}

	//===========================Công việc chi tiết popup=================================================
	CongViecChanged(val) {
		const dialogRef = this.dialog.open(CongViecDialogComponent, { data: { _item: val } });
		dialogRef.afterClosed().subscribe(res => {
			this.LoadNodeDetails();
		});
	}

	StatusCongViecChange(dt, val) {
		let item = {
			ID: +dt.RowID,
			Status: val.checked ? 2 : 1,
		}
		this.processWorkService.updateStatusToDo(item).subscribe(res => {
			if (res && res.status == 1) {
				this.LoadNodeDetails();
			} else {
				this.LoadNodeDetails()
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			}
		});
	}

	//=====================================Xử lý cập nhật tính trạng giai đoạn
	//===============Các hàm xử lý tạo class===============
	getItemStatusString(status: number): string {
		switch (status) {
			case 0:
				return 'Đang tạm dừng';
			case 1:
				return 'Đang thực hiện';
			case 2:
				return 'Hoàn thành';
		}
		return 'Chưa thực hiện';
	}
	getItemCssClassByStatus(status: number): string {
		switch (status) {
			case 0:
				return 'metal';
			case 1:
				return 'primary';
			case 2:
				return '#9acd32';
		}
		return 'warning';
	}

	getClassFinishGD(td: any): string {
		if (td.IsQuaHan) {
			return 'mat-slider-finish'
		}
		return '';
	}

	getClassFinishQT(td: any): string {
		if (td.IsQuaHan) {
			return 'mat-slider-finish'
		}
		return '';
	}

	getClassFinishNodeGD(td: any): string {
		if (td.IsQuaHan) {
			return 'mat-slider-finish'
		}
		return 'mat-slider-1';
	}

	getHanChot(item): string {
		if (item.IsEditDeadline) {
			return 'css-hanchot'
		}
		return '';
	}

	BgButton(status: number): any {
		switch (status) {
			case 0:
				return 'btn-tamdung';
			case 1:
				return 'btn-thuchien';
			case 2:
				return 'btn-hoanthanh';

		}
		return 'btn-chuathuchien';
	}

	getColorProcessBar(item) {
		if (document.getElementsByClassName("light-mode").length > 0) {
			if (item.IsQuaHan) {
				return 'rgb(175, 15, 15)';
			} else {
				if (item.Status == 1) {
					return 'rgb(255, 184, 34)';
				} else if (item.Status == 0) {
					return '#f64e60';
				} else {
					return '#9acd32';
				}
			}
		} else {
			if (item.IsQuaHan) {
				return '#f64e60';
			} else {
				if (item.Status == 1) {
					return '#ffa800';
				} else if (item.Status == 0) {
					return '#f64e60';
				} else {
					return '#0bb783';
				}
			}
		}
	}
	getColorProcessBar_QT(item) {
		if (document.getElementsByClassName("light-mode").length > 0) {
			if (item.IsQuaHan) {
				return 'rgb(175, 15, 15)';
			} else {
				return '#9acd32';
			}
		} else {
			if (item.IsQuaHan) {
				return '#f64e60';
			} else {
				return '#0bb783';
			}
		}
	}
	getBgNumber(dt) {
		let obj = "";
		if (document.getElementsByClassName("light-mode").length > 0) {
			obj = dt.status == '3' ? '#b9f3beb8' : dt.status == '-1' ? '#efb5b5db' : dt.Status == '0' ? '#f64e60' : dt.Status == '1' ? 'rgb(255, 184, 34)' : dt.Status == '2' ? '#9acd32' : (dt.Status == null && dt.AssignDate != '') ? 'gray' : 'white';
		} else {
			obj = dt.status == '3' ? '#0BB783' : dt.status == '-1' ? '#F64E60' : dt.Status == '0' ? '#F64E60' : dt.Status == '1' ? '#ffa800' : dt.Status == '2' ? '#0BB783' : (dt.Status == null && dt.AssignDate != null) ? 'gray' : '#1e1e2d'
		}
		return obj;
	}
	//=======================================Cập nhật thông tin giai đoạn=============================
	CapNhatGiaiDoan(val) {
		const _title = this.translate.instant('workprocess.capnhatgiaidoan');
		let _description: any;
		if (val == 0) {
			_description = this.translate.instant('workprocess.bancochacchanmuontamdung');
		}
		if (val == 1) {
			_description = this.translate.instant('workprocess.bancochacchanmuonthuchien');
		}
		if (val == 2) {
			_description = this.translate.instant('workprocess.bancochacchanmuonhoanthanh');
		}
		const _waitDesciption = this.translate.instant('workprocess.dulieudangduocxyly');

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			if (val == 0) {
				const dialogRef = this.dialog.open(DialogDecision, {
					data: { _type: 2, _GiaiDoanID: this.GiaiDoanID, }, panelClass: ['sky-padding-0', 'width600']
				});
				dialogRef.afterClosed().subscribe(res => {
					if (!res) {
						return;
					}
					this.LoadNodeDetails(); this.LoadData();
				});
			} else {
				let item = {
					ID: +this.GiaiDoanID,
					Status: +val,
				}
				this.processWorkService.updateStatusNode(item).subscribe(res => {
					if (res && res.status == 1) {
						this.LoadNodeDetails(); this.LoadData();
					} else if (res && res.status == 2) {
						this.ChuyenGiaiDoan();
					} else {
						this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
					}
				});
			}
		});

	}

	//=======================Gọi form cập nhật hạn chót===========================================
	date: any = '';
	UpdateHanChot(_item: any) {
		if (_item.IsEditDeadline) {
			let item = {
				ID: +this.GiaiDoanID,
				Date: moment(this.date).utc().format("YYYY-MM-DDTHH:mm:ss"),
			}
			this.processWorkService.updateDeadline(item.ID, item.Date).subscribe(res => {
				if (res && res.status == 1) {
					this.LoadNodeDetails();
				} else {
					this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
				}
			});
		}
	}
	//=============================Thêm người theo dõi quy trình================================================
	ListNguoiTheoDoi: any;
	AddTheoDoi(item: any) {//Type == 4
		let _item = [];
		item.NguoiTheoDoi.map((item, index) => {
			_item.push('' + item.NVID);
		});

		let _itemExcept = [];
		this.itemQT.NguoiQuanLy.map((item, index) => {
			_itemExcept.push('' + item.NVID);
		});
		const dialogRef = this.dialog.open(JeeChooseMemberComponent, { data: { _item, _itemExcept }, panelClass: ['sky-padding-0', 'width600'], });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			if (res.data.length > 0) {
				this.ListNguoiTheoDoi = [];
				res.data.map((item, index) => {
					this.ListNguoiTheoDoi.push(item.UserId);
				})
			} else {
				this.ListNguoiTheoDoi = [];
			}
			let _data = {
				ID: this.WorkID,/// 1: id node; 2: id todo; 3: id process 
				Type: 2,  /// 1: người thực hiện, 2: người theo dõi (quy trình); 3: người theo dõi (công việc chi tiết) 
				WorkType: 3,  /// 1: công việc; 2: công việc chi tiết; 3: quy trình
				NVIDList: this.ListNguoiTheoDoi
			}
			this.LuuNguoiTheoDoi(_data);
		});
	}

	LuuNguoiTheoDoi(_item: any) {
		this.processWorkService.updateImplementer(_item).subscribe(res => {
			if (res && res.status == 1) {
				this.LoadChiTietQuyTrinh();
			} else {
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			}
		});
	}

	//======================Follow quy trình======================================
	TheoDoi(item) {
		this.processWorkService.FollowNode(this.WorkID, !item.IsFollow, 3).subscribe(res => {
			if (res && res.status === 1) {
				this.LoadChiTietQuyTrinh();
			}
			else {
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			}
		});
	}

	//======================Xóa người theo dõi======================================
	XoaNguoiTheoDoi(_item: any) {
		this.processWorkService.delFollower(this.WorkID, _item.NVID, 3).subscribe(res => {
			if (res && res.status === 1) {
				this.LoadChiTietQuyTrinh();
			}
			else {
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			}
		});
	}

	//===================================Chuyển về giai đoan trước===========================
	ChuyenGiaiDoanTruoc() {
		let _item = {
			NodeID: this.GiaiDoanID,
			InfoChuyenGiaiDoanData: [],
			IsNext: false,
			NodeListID: 0,
		};
		this.layoutUtilsService.showWaitingDiv();
		this.dynamicFormService.ChuyenGiaiDoan(_item).subscribe(res => {
			this.layoutUtilsService.OffWaitingDiv();
			this.changeDetectorRefs.detectChanges();
			if (res && res.status === 1) {
				this.ShowGD = false;
				this.ShowQT = true;
				this.LoadData();
				this.LoadChiTietQuyTrinh();
			} else if (res && res.status === 2) {
				const dialogRef = this.dialog.open(DialogDecision, { data: { _item: {}, _type: 7, _nodeList: res.data, _nodeID: this.GiaiDoanID }, panelClass: ['sky-padding-0', 'width600'], });
				dialogRef.afterClosed().subscribe(res => {
					if (!res) {
						return;
					}
					else {
						this.ShowGD = false;
						this.ShowQT = true;
						this.LoadData();
						this.LoadChiTietQuyTrinh();
					}
				});
			}
			else {
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			}
		});
	}

	//====================================Xem chi tiết quy trình con================================
	ChuyenTiepWF() {
		let url = this.router.createUrlTree([`/ProcessWork/Tab/${this.ID_QuyTrinh}/Node/${this.GiaiDoanQTC}`]);
		window.open(url.toString(), '_blank')
	}

	DanhDauHoanThanh() {
		const dialogRef = this.dialog.open(DialogDecision, { data: { _item: {}, _type: 12, _TaskID: this.WorkID, _ProcessID: this.ID_QuyTrinh, _TypeReason: 1 }, panelClass: ['sky-padding-0', 'width600'], });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.LoadChiTietQuyTrinh();
			this.ShowQT = true;
			this.ShowGD = false;
		});
	}

	DanhDauThatBai() {
		const dialogRef = this.dialog.open(DialogDecision, { data: { _item: {}, _type: 12, _TaskID: this.WorkID, _ProcessID: this.ID_QuyTrinh, _TypeReason: 0 }, panelClass: ['sky-padding-0', 'width600'], });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.LoadChiTietQuyTrinh();
			this.ShowQT = true;
			this.ShowGD = false;
		});
	}

	XemTruoc(item) {
		let obj = item.filename.split(".")[item.filename.split(".").length - 1];
		if (obj == "jpg" || obj == "png" || obj == "jpeg") {
			window.open(item.link);
		}
		if (obj == "xls" || obj == "xlsx" || obj == "doc" || obj == "docx") {
			this.layoutUtilsService.ViewDoc_WF(item.link);
		}
		if (obj == "pdf") {
			this.layoutUtilsService.ViewPdf_WF(item.link);
		}
	}

	ShowXemTruoc(item) {
		let show = false;
		let obj = item.filename.split(".")[item.filename.split(".").length - 1];
		if (obj == "jpg" || obj == "png" || obj == "jpeg" || obj == "xls" || obj == "xlsx" || obj == "doc" || obj == "docx" || obj == "pdf") {
			show = true;
		}
		return show;
	}

	meImage;
	TaiXuong(item) {
		let obj = item.filename.split(".")[item.filename.split(".").length - 1];
		if (obj == "jpg" || obj == "png" || obj == "jpeg") {
			const splitUrl = item.link.split("/");
			const filename = splitUrl[splitUrl.length - 1];
			fetch(item.link)
				.then((response) => {
					response.arrayBuffer().then(function (buffer) {
						const url = window.URL.createObjectURL(new Blob([buffer]));
						const link = document.createElement("a");
						link.href = url;
						link.setAttribute("download", filename); //or any other extension
						document.body.appendChild(link);
						link.click();
						document.body.removeChild(link);
					});
				})
				.catch((err) => {
					console.log(err);
				});
		} else {
			window.open(item.link);
		}
	}

	ThemTaiLieu() {
		const dialogRef = this.dialog.open(DialogDecision, { data: { _type: 16, _TaskID: this.WorkID }, panelClass: ['sky-padding-0', 'width600'], });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.LoadChiTietQuyTrinh();
		});
	}

	XoaTaiLieu(item) {
		const _title = this.translate.instant('landingpagekey.xoa');
		const _description = this.translate.instant('landingpagekey.bancochacchanmuonxoakhong');
		const _waitDesciption = this.translate.instant('landingpagekey.dulieudangduocxoa');
		const _deleteMessage = this.translate.instant('landingpagekey.xoathanhcong');

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			let _item = {
				RowID: +this.WorkID,
				DescriptionFileDelete: item.filename_full,
				isAdd: false,
			}
			this.processWorkService.updateTaiLieu(_item).subscribe(res => {
				if (res && res.status === 1) {
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete, 4000, true, false, 3000, 'top', 1);
				}
				else {
					this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
				}
				this.LoadChiTietQuyTrinh();
			});
		});
	}

	//=============================Di chuyển các node trong quy trình=============================
	positionChange(args: IDraggingEventArgs) {
		if (args.state === 'Completed') {
			this.addItem();
		}
	}

	addItem() {
		let mod = new NodeProcessModel();
		mod.ProcessID = this.GiaiDoanID;
		let dt_node = [];
		this.diagram.nodes.map((item, index) => {
			let val = {
				id: item.id.substring(1),
				title: item.annotations.length > 0 ? item.annotations[0].content : '',
				shape: item.shape['shape'],
				height: item.height,
				width: item.width,
				rotateAngle: item.rotateAngle,
				offsetX: item.offsetX,
				offsetY: item.offsetY,
				processid: '',
			}
			dt_node.push(val);
		});
		mod.NodeList = dt_node;
		let dt_connector = [];
		this.diagram.connectors.map((item, index) => {
			if (item.sourcePortID == "") {
				let obj = this.diagram.nodes.find(x => x.id == item.sourceID);
				if (obj) {

				}
			}
			if (item.targetPortID == "") {
				let obj = this.diagram.nodes.find(x => x.id == item.targetID);
				if (obj) {

				}
			}
			let val = {
				id: item.id,
				sourceID: item.sourceID.substring(1),
				targetID: item.targetID.substring(1),
				title: item.annotations.length > 0 ? item.annotations[0].content : '',
				type: item.type,
				sourcePortID: item.sourcePortID,
				targetPortID: item.targetPortID,
				sourcePointX: item.sourcePoint.x,
				sourcePointY: item.sourcePoint.y,
				targetPointX: item.targetPoint.x,
				targetPointY: item.targetPoint.y,
			}
			dt_connector.push(val);
		});
		mod.RelationshipListData = dt_connector;
		this.layoutUtilsService.showWaitingDiv();
		this.processWorkService.Update_NodePosition(mod).subscribe(res => {
			this.layoutUtilsService.OffWaitingDiv();
			this.LoadData();
		})
	};

	//==============================Xử lý tỷ lệ =========================
	public TyLe: string = '6/6';
	public ShowDiagram: boolean = false;
	getTyLeLeft() {
		let obj = this.TyLe.split('/');
		if (obj) {
			return obj[0];
		}
	}
	getTyLeRight() {
		let obj = this.TyLe.split('/');
		if (obj) {
			return obj[1];
		}
	}

	LuuTyLe(val) {
		let item = {
			ProcessID: this.WorkID,
			TyLe: val,
		}
		this.ShowDiagram = false;
		this.processWorkService.Update_TyLe(item).subscribe(res => {
			if (res && res.status == 1) {
				this.TyLe = val;
				this.ShowDiagram = true;
				this.getImageTyLe(this.TyLe);
				this.LoadData();
				this.changeDetectorRefs.detectChanges();
			}
		})
	}

	//=========================Chỉnh sửa giao diện tổng quan 28/10/2021===============================
	selectedTab: number = 0;
	onLinkClick(eventTab: MatTabChangeEvent) {
		this.ID_Project = 0
		this.selectedTab = eventTab.index;
		if (this.selectedTab == 2) {
			this.loadHoatDong();
		}
		if (this.selectedTab == 4) {
			this.ID_Project = this.itemQT.DuAnListID;
		}
	}
	//=================Start Tab Tổng Quan====================
	//====Cập nhật dữ liệu đầu vào hoặc dữ liệu giai đoạn
	NodeRoot: string = '';
	ChinhSua(TypeID: string) {
		let ID = 0;
		if (TypeID == "1") {
			ID = +this.NodeRoot;
		} else {
			ID = this.GiaiDoanID;
		}
		this.layoutUtilsService.showWaitingDiv();
		this.processWorkService.Get_NodeDetail(+ID).subscribe(res => {
			this.layoutUtilsService.OffWaitingDiv();
			if (res.status == 1) {
				if (res.data.DataFields.length > 0) {
					let isFlag = false;
					res.data.DataFields.map((item, index) => {
						if (item.IsFieldNode) {
							isFlag = true;
						}
					})
					if (isFlag) {
						const dialogRef = this.dialog.open(DialogDecision, { data: { _item: {}, _type: 13, _DatField: res.data.DataFields }, panelClass: ['sky-padding-0', 'width600'], });
						dialogRef.afterClosed().subscribe(res => {
							if (!res) {
								return;
							} else {
								if (TypeID == "1") {
									this.LoadChiTietQuyTrinh();
								} else {
									this.LoadNodeDetails()
								}
							}
						});
					} else {
						this.layoutUtilsService.showActionNotification("Không có dữ liệu", MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
					}
				} else {
					this.layoutUtilsService.showActionNotification("Không có dữ liệu", MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
				}

				this.changeDetectorRefs.detectChanges();
			} else {
				this.changeDetectorRefs.detectChanges();
			}
		})
	}
	//=================End Tab Tổng Quan======================
	//=================Start Tab Hoạt Động====================
	ListData: any[] = [];
	loadHoatDong(page: boolean = false) {
		const queryParams = new QueryParamsModelNew(
			this.filterConfiguration(),
			'',
			'',
			0,
			100,
			true
		);

		this.layoutUtilsService.showWaitingDiv();
		this.processWorkService.getActivityLog_Process(queryParams)
			.pipe(
				tap(resultFromServer => {
					this.layoutUtilsService.OffWaitingDiv();
					if (resultFromServer.status == 1) {
						if (resultFromServer.data.length > 0) {
							this.ListData = resultFromServer.data;
						}
						else {
							this.ListData = [];
						}
					}
					else {
						this.ListData = [];
					}
					this.changeDetectorRefs.detectChanges();
				})
			).subscribe();
	}

	filterConfiguration(): any {
		const filter: any = {};
		filter.taskid = this.WorkID;
		return filter;
	}

	getIcon(item: any): string {
		let _icon = '';
		if (item.Type == 1) {
			_icon = 'flaticon2-add-square';
		} else if (item.Type == 2) {
			_icon = 'flaticon2-accept';
		} else if (item.Type == 3) {
			_icon = 'flaticon-reply';
		} else if (item.Type == 4) {
			_icon = 'flaticon-delete';
		} else if (item.Type == 5) {
			_icon = 'flaticon-user-add';
		} else if (item.Type == 6) {
			_icon = 'flaticon-user-add';
		} else if (item.Type == 10) {
			_icon = 'flaticon2-check-mark';
		} else {
			_icon = 'flaticon2-cross';
		}
		return _icon;
	}

	getMatIcon(item: any): string {
		let _icon = '';
		if (item.Type == 7) {
			_icon = 'alarm';
		} else if (item.Type == 8) {
			_icon = 'pause_circle_outline';
		} else {
			_icon = 'alarm_on';
		}
		return _icon;
	}

	ListData_GD: any[] = [];
	loadHoatDong_GD(page: boolean = false) {
		const queryParams = new QueryParamsModelNew(
			this.filterConfiguration_GD(),
			'',
			'',
			0,
			100,
			true
		);

		this.layoutUtilsService.showWaitingDiv();
		this.processWorkService.getActivityLog_ProcessNode(queryParams)
			.pipe(
				tap(resultFromServer => {
					this.layoutUtilsService.OffWaitingDiv();
					if (resultFromServer.status == 1) {
						if (resultFromServer.data.length > 0) {
							this.ListData_GD = resultFromServer.data;
						}
						else {
							this.ListData_GD = [];
						}
					}
					else {
						this.ListData_GD = [];
					}
					this.changeDetectorRefs.detectChanges();
				})
			).subscribe();
	}

	filterConfiguration_GD(): any {

		const filter: any = {};
		filter.stageid = this.GiaiDoanID;
		return filter;
	}

	getIcon_GD(item: any): string {
		let _icon = '';
		if (item.Type == 1) {
			_icon = 'flaticon2-add-square';
		} else if (item.Type == 2) {
			_icon = 'flaticon2-accept';
		} else if (item.Type == 3) {
			_icon = 'flaticon-reply';
		} else if (item.Type == 4) {
			_icon = 'flaticon-delete';
		} else if (item.Type == 5) {
			_icon = 'flaticon-user-add';
		} else if (item.Type == 6) {
			_icon = 'flaticon-user-add';
		} else if (item.Type == 10) {
			_icon = 'flaticon2-check-mark';
		} else {
			_icon = 'flaticon2-cross';
		}
		return _icon;
	}

	getMatIcon_GD(item: any): string {
		let _icon = '';
		if (item.Type == 7) {
			_icon = 'alarm';
		} else if (item.Type == 8) {
			_icon = 'pause_circle_outline';
		} else {
			_icon = 'alarm_on';
		}
		return _icon;
	}
	//=================End Tab Hoạt Động====================
	//=================Start Tab Bình Luận==================
	countComment: any;
	CountComment() {
		this.processWorkService.Count_Comment(this.topicObjectID$.value).subscribe(res => {
			this.countComment = res.Comments.length;
			this.changeDetectorRefs.detectChanges();
		})
	}
	//=================End Tab Bình Luận====================

	//=========================Chỉnh sửa giao diện tổng quan 30/10/2021===============================
	selectedTabGD: number = 0;
	onLinkClick_GD(eventTab: MatTabChangeEvent) {
		this.selectedTabGD = eventTab.index;
		this.ID_Project_GD = 0;
		if (this.selectedTabGD == 2) {
			this.loadHoatDong_GD();
		}
		if (this.selectedTabGD == 3) {
			this.ID_Project_GD = this.itemGD.listid;
		}
	}

	ContentStr: string = '';
	ListKetQua: any[] = [];

	ChangeMauQuyetDinh(item) {
		this.loadDynamic(item, 0, true);
	}

	//========================Start tab công việc liên kết==============================
	ShowCongViecLK: boolean = false;
	listAppCode: any[] = [];
	@Input() ID_Project: number = 0;
	CheckJeeWork() {
		let obj = this.listAppCode.find(x => x == environment.APPCODE_JEEWORK)
		if (obj) {
			this.ShowCongViecLK = true;
		} else {
			this.ShowCongViecLK = false;
		}
	}

	TaoCongViecLienKet() {
		if (this.ShowCongViecLK) {
			const item = this.TenNhiemVu;
			const dialogRef = this.dialog.open(TemplateCenterComponent, {
				data: { item, _isThietLap: false, _nodeID: 0 },
				width: '50vw', panelClass: 'sky-padding-0',
			});
			dialogRef.afterClosed().subscribe((res) => {
				if (!res) {
					return;
				} else {
					this.UpdateDuAn_NhiemVu(res.ListID);
					this.changeDetectorRefs.detectChanges();
				}
			});
		}
	}

	UpdateDuAn_NhiemVu(id) {
		let item = {
			ProcessID: this.WorkID,
			ListID: id,
		}
		this.processWorkService.Update_DuAn_NhiemVu(item).subscribe(res => {
			if (res && res.status == 1) {
				this.ID_Project = id;
				this.LoadChiTietQuyTrinh();
				this.changeDetectorRefs.detectChanges();
			}
		})
	}

	getWidthWW() {
		let tmp_width = 0;
		tmp_width = document.getElementById("width-ww").clientWidth;
		return tmp_width + "px";
	}
	//========================End công việc liên kết==============================

	//========================Start tab công việc liên kết giai đoạn==============================
	@Input() ID_Project_GD: number = 0;
	TaoCongViecLienKet_GD() {
		if (this.ShowCongViecLK) {
			const item = this.itemGD.CongViec;
			const dialogRef = this.dialog.open(TemplateCenterComponent, {
				data: { item, _isThietLap: false, _nodeID: 0 },
				width: '50vw',
			});
			dialogRef.afterClosed().subscribe((res) => {
				if (!res) {
					return;
				} else {
					this.UpdateDuAn_NhiemVu_GD(res.ListID);
					this.changeDetectorRefs.detectChanges();
				}
			});
		}
	}

	UpdateDuAn_NhiemVu_GD(id) {
		let item = {
			GiaiDoanID: this.GiaiDoanID,
			ListID: id,
		}
		this.processWorkService.Update_DuAn_NhiemVu_GD(item).subscribe(res => {
			if (res && res.status == 1) {
				this.ID_Project_GD = id;
				this.LoadNodeDetails();
				this.changeDetectorRefs.detectChanges();
			}
		})
	}

	getWidthWW_GD() {
		let tmp_width = 0;
		if (this.selectedTabGD == 3 && this.ID_Project_GD > 0) {
			tmp_width = document.getElementById("width-ww-gd").clientWidth;
		}
		return tmp_width + "px";
	}
	//========================End công việc liên kết==============================
	public diagramCreate(args: Object): void {
		this.diagram.scrollSettings = {
			canAutoScroll: true, scrollLimit: 'Infinity',
			scrollableArea: new Rect(0, 0, 300, 300), horizontalOffset: 0
		}
		this.diagram.tool = null;
		this.diagram.dataBind();
	}

	//=========================Dark Theme=========================================
	downFile(item) {
		let obj = item.filename.split(".")[item.filename.split(".").length - 1];
		if (obj == "jpg" || obj == "png" || obj == "jpeg") {
			const splitUrl = item.link.split("/");
			const filename = splitUrl[splitUrl.length - 1];
			fetch(item.link)
				.then((response) => {
					response.arrayBuffer().then(function (buffer) {
						const url = window.URL.createObjectURL(new Blob([buffer]));
						const link = document.createElement("a");
						link.href = url;
						link.setAttribute("download", filename); //or any other extension
						document.body.appendChild(link);
						link.click();
						document.body.removeChild(link);
					});
				})
				.catch((err) => {
					console.log(err);
				});
		} else {
			window.open(item.link);
		}
	}

	//======================Bổ sung node thông tin liên quan=====================
	ThongTinLienQuan: string;

	//==========================Bổ sung thay đổi người quản lý giai đoạn 04/10/2022==========
	ThayDoiNguoiQuanLy() {
		let saveMessageTranslateParam = '';
		saveMessageTranslateParam = 'landingpagekey.capnhatthanhcong';
		const _saveMessage = this.translate.instant(saveMessageTranslateParam);
		const _messageType = MessageType.Create;
		const dialogRef = this.dialog.open(DialogDecision, {
			data: { _type: 18, _GiaiDoanID: this.GiaiDoanID, _DataNguoiQuanLy: this.itemGD.NguoiQuanLy }, panelClass: ['sky-padding-0', 'width600'],

		});
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 4000, true, false);
			this.LoadNodeDetails();
		});
	}

	//=====================================================================
	getImageTyLe(val: any) {
		let tyle = "";
		if (val == "4/8") {
			tyle = environment.HOST_MINIO + "/jee-workflow/image/layout/37.png";
		}
		if (val == "5/7") {
			tyle = environment.HOST_MINIO + "/jee-workflow/image/layout/46.png";
		}
		if (val == "6/6") {
			tyle = environment.HOST_MINIO + "/jee-workflow/image/layout/55.png";
		}
		if (val == "7/5") {
			tyle = environment.HOST_MINIO + "/jee-workflow/image/layout/64.png";
		}
		if (val == "8/4") {
			tyle = environment.HOST_MINIO + "/jee-workflow/image/layout/73.png";
		}
		return tyle;
	}
}
