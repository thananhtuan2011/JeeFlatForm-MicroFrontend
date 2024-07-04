// Angular
import {
	Component,
	OnInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Inject,
	ViewChild,
	ElementRef,
} from "@angular/core";
import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
} from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
// Material

// RxJS
import { Observable, Subscription, ReplaySubject } from "rxjs";
// Service
import { DiagramComponent, TextStyleModel, AnnotationConstraints, DiagramTooltipModel } from '@syncfusion/ej2-angular-diagrams';
import {
	Diagram, NodeModel, UndoRedo, ConnectorModel,
	SymbolInfo, IDragEnterEventArgs, IDragLeaveEventArgs,
	PaletteModel,
	IDragOverEventArgs, IClickEventArgs, IHistoryChangeArgs, IDoubleClickEventArgs,
	ITextEditEventArgs, IScrollChangeEventArgs, ISelectionChangeEventArgs, ISizeChangeEventArgs,
	IConnectionChangeEventArgs, IEndChangeEventArgs, IPropertyChangeEventArgs, IDraggingEventArgs, IRotationEventArgs,
	ICollectionChangeEventArgs,
	IMouseEventArgs, DiagramContextMenu, Snapping, SnapConstraints, SnapSettingsModel, ContextMenuSettingsModel, MarginModel,
	DiagramBeforeMenuOpenEventArgs,
	NodeConstraints, Node, DataBinding, HierarchicalTree, DiagramTools, Thickness, DiagramConstraints
} from '@syncfusion/ej2-diagrams';
import { ExpandMode } from '@syncfusion/ej2-navigations';
import { MenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { ListView } from '@syncfusion/ej2-lists';
import { DataManager } from '@syncfusion/ej2-data';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DungChungFileModel } from "../../_models/quan-ly-cuoc-hop.model";
import { QuanLyCuocHopService } from "../../_services/quan-ly-cuoc-hop.service";
import { environment } from "projects/jeemeet/src/environments/environment";
import { LayoutUtilsService, MessageType } from "projects/jeemeet/src/modules/crud/utils/layout-utils.service";

Diagram.Inject(UndoRedo, DiagramContextMenu);


@Component({
	selector: 'app-diagram-view',
	templateUrl: './diagram-view.component.html',
  styleUrls: ['./diagram-view.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})





export class DiagramViewAddComponent implements OnInit {
	@ViewChild('diagram', { static: true })
	public diagram: DiagramComponent;
	public node: NodeModel;
	public tooltip: DiagramTooltipModel;
	public getSymbolDefaults(symbol: NodeModel): void {
		symbol.width = 50;
		symbol.height = 50;
		symbol.constraints = NodeConstraints.Default | NodeConstraints.AllowDrop;
		symbol.style.strokeColor = '#6BA5D7';
		symbol.style.fill = '#6BA5D7';

	}


	public snapSettings: SnapSettingsModel = { constraints: SnapConstraints.None };


	public symbolMargin: MarginModel = { left: 15, right: 15, top: 15, bottom: 15 };


	public expandMode: ExpandMode = 'Multiple';


	public getSymbolInfo(symbol: NodeModel): SymbolInfo {
		return { fit: true };
	}


	public dragEnter(args: IDragEnterEventArgs): void {
		this.getEventDetails(args);

	}


	public dragLeave(args: IDragLeaveEventArgs): void {
		this.getEventDetails(args);

	}


	public dragOver(args: IDragOverEventArgs): void {
		if (args.target) {
			this.getEventDetails(args);
		}

	}


	public click(args: IClickEventArgs): void {
		if (args.element instanceof Node) {
			this.diagram.startTextEdit();
			this.applyAnnotationStylenotationStyle("click", "");
			this.diagram.endEdit();
		}
		this.getEventDetails(args);

	}


	public historyChange(args: IHistoryChangeArgs): void {
		this.getEventDetails(args);

	}


	public doubleClick(args: IDoubleClickEventArgs): void {
		this.getEventDetails(args);

	}


	public textEdit(args: ITextEditEventArgs): void {
		// this.onFontColorChange();
		this.getEventDetails(args);

	}


	public scrollChange(args: IScrollChangeEventArgs): void {
		this.getEventDetails(args);

	}


	public selectionChange(args: ISelectionChangeEventArgs): void {
		this.getEventDetails(args);

	}


	public sizeChange(args: ISizeChangeEventArgs): void {
		if (args.state === 'Completed') {
			this.getEventDetails(args);
		}

	}


	public connectionChange(args: IConnectionChangeEventArgs): void {
		if (args.state === 'Changed') {
			this.getEventDetails(args);
		}

	}


	public sourcePointChange(args: IEndChangeEventArgs): void {
		if (args.state === 'Completed') {
			this.getEventDetails(args);
		}

	}


	public targetPointChange(args: IEndChangeEventArgs): void {
		if (args.state === 'Completed') {
			this.getEventDetails(args);
		}

	}


	public propertyChange(args: IPropertyChangeEventArgs): void {
		this.getEventDetails(args);

	}


	public positionChange(args: IDraggingEventArgs): void {
		if (args.state === 'Completed') {
			this.getEventDetails(args);
		}

	}


	public rotateChange(args: IRotationEventArgs): void {
		if (args.state === 'Completed') {
			this.getEventDetails(args);
		}

	}


	public collectionChange(args: ICollectionChangeEventArgs): void {
		this.getEventDetails(args);

	}


	public mouseEnter(args: IMouseEventArgs): void {
		this.getEventDetails(args);

	}


	public mouseLeave(args: IMouseEventArgs): void {
		this.getEventDetails(args);

	}


	public mouseOver(args: IMouseEventArgs): void {
		this.getEventDetails(args);

	}


	public contextMenuOpen(args: DiagramBeforeMenuOpenEventArgs): void {
		this.getEventDetails(args);

	}

	public contextMenuBeforeItemRender(args: MenuEventArgs): void {
		this.getEventDetails(args);

	}


	public contextMenuClick(args: MenuEventArgs): void {
		this.getEventDetails(args);

	}


	//Initialize the basicshapes for the symbol palatte
	public basicShapes: NodeModel[] = [
		{ id: 'Rectangle', shape: { type: 'Basic', shape: 'Rectangle' } },
		{ id: 'Ellipse', shape: { type: 'Basic', shape: 'Ellipse' } },
		{ id: 'Parallelogram', shape: { type: 'Basic', shape: 'Parallelogram' } },
		{ id: 'Triangle', shape: { type: 'Basic', shape: 'Triangle' } },
		{ id: 'Hexagon', shape: { type: 'Basic', shape: 'Hexagon' } },
		{ id: 'Pentagon', shape: { type: 'Basic', shape: 'Pentagon' } },
		{ id: 'Cylinder', shape: { type: 'Basic', shape: 'Cylinder' } },
		{ id: 'Plus', shape: { type: 'Basic', shape: 'Plus' } },
		{ id: 'Heptagon', shape: { type: 'Basic', shape: 'Heptagon' } },
		{ id: 'Octagon', shape: { type: 'Basic', shape: 'Octagon' } },
		{ id: 'Trapezoid', shape: { type: 'Basic', shape: 'Trapezoid' } },
		{ id: 'Decagon', shape: { type: 'Basic', shape: 'Decagon' } },
		{ id: 'RightTriangle', shape: { type: 'Basic', shape: 'RightTriangle' } },
		{ id: 'Diamond', shape: { type: 'Basic', shape: 'Diamond' } },
		{ id: 'Star', shape: { type: 'Basic', shape: 'Star' } }

	];


	//Initializes connector symbols for the symbol palette
	public connectorSymbols: ConnectorModel[] = [
		{
			id: 'Link1', type: 'Orthogonal', sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 60, y: 60 },
			targetDecorator: { shape: 'Arrow', style: { strokeColor: '#fd397a', fill: '#fd397a' } }, style: { strokeWidth: 1, strokeColor: '#fd397a' }
		},
		{
			id: 'link3', type: 'Orthogonal', sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 60, y: 60 },
			style: { strokeWidth: 1, strokeColor: '#fd397a' }, targetDecorator: { shape: 'None' }
		},
		{
			id: 'Link21', type: 'Straight', sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 60, y: 60 },
			targetDecorator: { shape: 'Arrow', style: { strokeColor: '#fd397a', fill: '#fd397a' } }, style: { strokeWidth: 1, strokeColor: '#fd397a' }
		},
		{
			id: 'link23', type: 'Straight', sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 60, y: 60 },
			style: { strokeWidth: 1, strokeColor: '#fd397a' }, targetDecorator: { shape: 'None' }
		},
		{
			id: 'link33', type: 'Bezier', sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 60, y: 60 },
			style: { strokeWidth: 1, strokeColor: '#fd397a' }, targetDecorator: { shape: 'None' }
		},

	];


	public palettes: PaletteModel[] = [
		{ id: 'basic', expanded: true, symbols: this.basicShapes, iconCss: 'e-ddb-icons e-basic', title:'Hình, dạng' },

	];


	public contextMenu: ContextMenuSettingsModel = {
		show: true,

	}


	public getEventDetails(args: any): void {
		let data = this.eventInformation(args);

	}


	public getName(selectedItems: any, args: any): boolean {
		for (let i: number = 0; i < selectedItems.data.length; i++) {
			let eventName: string = selectedItems.data[i].id;
			if (eventName === args.name) {
				return true;
			}
		}
		return false;

	}


	public created() {
		this.diagram.add(this.nodeD);
		this.clearEventLog();

	}


	public clearEventLog(): void {

	}


	public eventInformation(args: any): void {

	}


	nodeD: NodeModel = {
		offsetX: 1400,
		offsetY: 900,
		width: 0,
		height: 0,
		visible: false

	};

	dataDiagram: string = '';
	dataDiagramD: string = '{"enableRtl":false,"locale":"en-US","animationComplete":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"click":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"collectionChange":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"commandExecute":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"connectionChange":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"contextMenuBeforeItemRender":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"contextMenuClick":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"contextMenuOpen":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"created":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"dataLoaded":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"doubleClick":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"dragEnter":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"dragLeave":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"dragOver":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"drop":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"expandStateChange":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"fixedUserHandleClick":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"historyChange":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"historyStateChange":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"keyDown":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"keyUp":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"mouseEnter":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"mouseLeave":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"mouseOver":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"onImageLoad":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"onUserHandleMouseDown":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"onUserHandleMouseEnter":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"onUserHandleMouseLeave":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"onUserHandleMouseUp":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"positionChange":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"propertyChange":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"rotateChange":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"scrollChange":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"segmentCollectionChange":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"selectionChange":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"sizeChange":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"sourcePointChange":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"targetPointChange":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"textEdit":{"_isScalar":false,"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"contextMenuSettings":{"show":true},"height":"900px","snapSettings":{"constraints":0,"gridType":"Lines","verticalGridlines":{"lineIntervals":[1.25,18.75,0.25,19.75,0.25,19.75,0.25,19.75,0.25,19.75],"snapIntervals":[20]},"horizontalGridlines":{"lineIntervals":[1.25,18.75,0.25,19.75,0.25,19.75,0.25,19.75,0.25,19.75],"snapIntervals":[20]}},"width":"100%","enablePersistence":false,"scrollSettings":{"viewPortWidth":0,"viewPortHeight":0,"currentZoom":1,"horizontalOffset":0,"verticalOffset":0,"padding":{"left":0,"right":0,"top":0,"bottom":0},"scrollLimit":"Diagram"},"rulerSettings":{"showRulers":false},"backgroundColor":"transparent","constraints":500,"layout":{"type":"None","enableAnimation":true,"connectionPointOrigin":"SamePoint","arrangement":"Nonlinear","enableRouting":false},"dataSourceSettings":{"dataManager":null,"dataSource":null,"crudAction":{"read":""},"connectionDataSource":{"crudAction":{"read":""}}},"mode":"SVG","layers":[{"id":"default_layer","visible":true,"lock":false,"objects":["x8PTN"],"zIndex":0,"objectZIndex":0}],"nodes":[{"offsetX":1400,"offsetY":900,"width":0,"height":0,"visible":false,"id":"x8PTN","shape":{"type":"Basic","shape":"Rectangle","cornerRadius":0},"ports":[],"zIndex":0,"container":null,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":0,"height":0},"offsetX":1400,"offsetY":900},"constraints":5240814,"style":{"fill":"white","gradient":{"type":"None"},"strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1},"annotations":[],"isExpanded":true,"expandIcon":{"shape":"None"},"fixedUserHandles":[],"inEdges":[],"outEdges":[],"parentId":"","processId":"","isPhase":false,"isLane":false}],"connectors":[],"pageSettings":{"orientation":"Landscape","height":null,"width":null,"background":{"source":"","color":"transparent"},"showPageBreaks":false,"fitOptions":{"canFit":false},"boundaryConstraints":"Infinity"},"selectedItems":{"nodes":[],"connectors":[],"wrapper":null,"constraints":16382,"userHandles":[]},"basicElements":[],"tooltip":{"content":""},"commandManager":{"commands":[]},"diagramSettings":{"inversedAlignment":true},"version":17.1}'
	Diagram: any;
	DiagramForm: FormGroup;

	viewO: number = 0;

	DiagramView: any = {};
	DiagramViewForm: FormGroup;
	viewLoading: boolean = false;
	hasFormErrors: boolean = false;
	private componentSubscriptions: Subscription;

	isSecretary: boolean = false;

	dataI: any;
	DungChungDropdown: DungChungFileModel = new DungChungFileModel();


	constructor(
		public dialogRef: MatDialogRef<DiagramViewAddComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private DiagramViewFB: FormBuilder,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		public service: QuanLyCuocHopService,
		private changeDetectorRefs: ChangeDetectorRef,
	//	private TokenStorage: TokenStorage,
		private translate: TranslateService
	) {

	}


	ngOnInit() {
		this.DiagramView = this.data.DiagramView;
		this.isSecretary = this.data.isSecretary ? this.data.isSecretary : false;
		if (this.DiagramView.Id > 0) {
			this.loadListParticipants();
			this.service.getDetail(this.DiagramView.Id).subscribe(res => {
				if (res && res.status == 1 && res.data) {
					this.Diagram = res.data;
					this.viewO = this.Diagram.Type;
					this.changeDetectorRefs.detectChanges();
					if (this.Diagram.Type == 0) {
						this.loadDiagram();
					}
					else if (this.Diagram.Type == 1) {
						if (this.Diagram.LinkFile) {
							document.getElementById("img_icon").setAttribute("src", environment.CDN_DOMAIN + this.Diagram.LinkFile)
						}
					}
				}
			});
		}

	}


	listParticipants: any[] = [];
	searchParticipants: string = '';
	listId_Participants: any[] = [];
	filteredId_Participants: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);


	loadListParticipants() {
		this.service.getParticipants(this.DiagramView.Id).subscribe(res => {
			if (res && res.status === 1) {
				if (res.data) {
					this.dataI = res.data;
					this.listParticipants = this.dataI.ListThamGia;
					this.filteredId_Participants.next(this.listParticipants.slice());
					this.changeDetectorRefs.detectChanges();
				}
			}
			else {
				const message = res.error.message;
				this.layoutUtilsService.showActionNotification(message, MessageType.Error, 2000, true, false);
			}
		},
			err => {
				const message = err.error.error.message;
				this.layoutUtilsService.showActionNotification(message, MessageType.Warning, 2000, true, false);
			},
		)

	}

	close() {
		this.dialogRef.close();
	}
	filterId_Participants() {
		if (!this.listParticipants) {
			return;
		}
		let search = this.DungChungDropdown.nonAccentVietnamese(this.searchParticipants)
		if (!search) {
			this.filteredId_Participants.next(this.listParticipants.slice());
			return;
		}
		this.filteredId_Participants.next(
			this.listParticipants.filter(ts =>
				this.DungChungDropdown.nonAccentVietnamese(ts.HoTen).indexOf(search) > -1)
		);
		this.changeDetectorRefs.detectChanges();

	}


	public loadDiagram() {
		if (this.Diagram && this.Diagram.Diagram != "") {
			this.diagram.loadDiagram(this.Diagram.Diagram);
		}
		else {
			this.Diagram = null;
		}
		this.changeDetectorRefs.detectChanges();

	}


	ngOnDestroy() {
		if (this.componentSubscriptions) {
			this.componentSubscriptions.unsubscribe();
		}

	}



	getTitle(): string {
		return 'Sơ đồ phòng họp';

	}


	isControlInvalid(controlName: string): boolean {
		const control = this.DiagramViewForm.controls[controlName];
		const result = control.invalid && control.touched;
		return result;

	}


	validateAllFormFields(DiagramViewForm: FormGroup) {
		Object.keys(DiagramViewForm.controls).forEach((field) => {
			const control = DiagramViewForm.get(field);
			if (control instanceof FormControl) {
				control.markAsTouched({ onlySelf: true });
			} else if (control instanceof FormGroup) {
				this.validateAllFormFields(control);
			}
		});

	}


	onAlertClose($event) {
		this.hasFormErrors = false;

	}


	numberOnly(event): boolean {
		const charCode = event.which ? event.which : event.keyCode;
		if (charCode > 31 && (charCode < 48 || charCode > 57)) {
			return false;
		}
		return true;

	}


	public saveDiagram() {
		this.viewLoading = true;
		this.dataDiagram = this.diagram.saveDiagram();
		let _data = this.prepareData();
		this.service.savePrivateDiagram(_data).subscribe(res => {
			if (res.status == 1) {
				const message = 'Cập nhật thành công!';
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 2500, true, false);
				this.dialogRef.close(true);
			}
			else {
				const message = res.error.message;
				this.layoutUtilsService.showActionNotification(message, MessageType.Error, 20000, true, false);
			}
			this.viewLoading = false;
		});

	}


	public prepareData() {
		const _data: any = {};

		_data.Id = this.data.DiagramView.Id;
		_data.PrivateDiagram = this.dataDiagram;

		return _data;

	}


	getInfoBackgroundColor(idUser: number = 0) {
		let index = this.diagram.saveDiagram().indexOf("*****" + idUser + "*****"); // "*****" or anything, use check
		if (index >= 0) {
			return "#0A9562"
		}
		return '#F48120';

	}


	getInfoBackgroundText(idUser: number = 0) {
		let index = this.diagram.saveDiagram().indexOf("*****" + idUser + "*****"); // "*****" or anything, use check
		if (index >= 0) {
			return "Đã được thêm vào sơ đồ"
		}
		return 'Chờ được thêm vào sơ đồ';

	}


	change(value) {
		if (value && value != "0") {
			let idUser = value + "";
			idUser = "*****" + idUser + "*****";
			let name = this.listParticipants.find(x => x.idUser == value).HoTen;
			let index = this.diagram.saveDiagram().indexOf(idUser);
			if (index >= 0) {
				this.removeAnnotationStylenotationStyle("textContent", "", idUser);
			}
			else {
				this.applyAnnotationStylenotationStyle("textContent", name, idUser);
			}
			this.changeDetectorRefs.detectChanges();
		}

	}


	isDelete(value) {
		if (value && value != "0") {
			let idUser = value + "";
			idUser = "*****" + idUser + "*****";
			let index = this.diagram.saveDiagram().indexOf(idUser);
			if (index >= 0) {
				return true;
			}
			else {
				return false;
			}
		}

	}


	applyAnnotationStylenotationStyle(propertyName: string, propertyValue: string, idUser: string = ""): void {
		for (let i: number = 0; i < this.diagram.selectedItems.nodes.length; i++) {
			this.node = this.diagram.selectedItems.nodes[i];
			if (this.node.data == undefined) {
				for (let j: number = 0; j < this.node.annotations.length; j++) {
					let textContent = this.node.annotations[j];
					let textStyle: TextStyleModel = this.node.annotations[j].style;
					if (propertyName === 'textContent') {
						textContent.content = propertyValue;
						textStyle.fontSize = 16;
						textStyle.color = 'Gold';
						this.diagram.selectedItems.nodes[i].data = idUser;
						// this.diagram.selectedItems.nodes[i].data = this.diagram.selectedItems.nodes[i].id + idUser;
						this.node.annotations[j].constraints = AnnotationConstraints.ReadOnly;
					}
					else if (propertyName === 'click') {
						this.node.annotations[j].constraints = AnnotationConstraints.ReadOnly;
					}
					this.diagram.dataBind();
				}
			}
		}

	}

	getHeight(): any {
		let tmp_height = 0;
		tmp_height = window.innerHeight - 110;
		return tmp_height + 'px';
	}

	removeAnnotationStylenotationStyle(propertyName: string, propertyValue: string, idUser: string = ""): void {
		if (propertyName === 'textContent') {
			for (let i = 0; i < this.diagram.nodes.length; i++) {
				if (this.diagram.nodes[i].data != undefined && this.diagram.nodes[i].data == idUser) {
					this.diagram.nodes[i].data = undefined;
					if (this.diagram.nodes[i].annotations.length > 0) {
						this.diagram.nodes[i].annotations[0].content = propertyValue;
						this.diagram.nodes[i].annotations[0].constraints = AnnotationConstraints.None;
					}
					break;
					// const index = this.diagram.nodes[i].data.toString().indexOf(idUser);
					// if (index >= 0) {
					// 	this.diagram.nodes[i].data = undefined;
					// 	if (this.diagram.nodes[i].annotations.length > 0) {
					// 		this.diagram.nodes[i].annotations[0].content = propertyValue;
					// 		this.diagram.nodes[i].annotations[0].constraints = AnnotationConstraints.None;
					// 	}
					// 	break;
					// }
				}
			}
		}

	}


}
