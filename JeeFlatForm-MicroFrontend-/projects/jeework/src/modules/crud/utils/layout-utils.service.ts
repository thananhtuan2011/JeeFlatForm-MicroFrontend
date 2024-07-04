// Angular
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActionNotificationComponent } from '../action-natification/action-notification.component';
import { DeleteEntityDialogComponent } from '../delete-entity-dialog/delete-entity-dialog.component';
import { DocViewerComponent } from '../doc-viewer/doc-viewer.component';
import { FetchEntityDialogComponent } from '../fetch-entity-dialog/fetch-entity-dialog.component';
import { UpdateStatusDialogComponent } from '../update-status-dialog/update-status-dialog.component';
// Partials for CRUD


export enum MessageType {
	Create,
	Read,
	Update,
	Delete
}

@Injectable()
export class LayoutUtilsService {
	/**
	 * Service constructor
	 *
	 * @param snackBar: MatSnackBar
	 * @param dialog: MatDialog
	 */
	constructor(private snackBar: MatSnackBar,
		           private dialog: MatDialog,
				   private modalService: NgbModal,) { }

	/**
	 * Showing (Mat-Snackbar) Notification
	 *
	 * @param message: string
	 * @param type: MessageType
	 * @param duration: number
	 * @param showCloseButton: boolean
	 * @param showUndoButton: boolean
	 * @param undoButtonDuration: number
	 * @param verticalPosition: 'top' | 'bottom' = 'top'
	 *  * @param horizontalPosition: 'start' | 'start' = 'start'
	 *

	 */
	showActionNotification(
		_message: string,
		_type: MessageType = MessageType.Create,
		_duration: number = 10000,
		_showCloseButton: boolean = true,
		_showUndoButton: boolean = true,
		_undoButtonDuration: number = 3000,
		_verticalPosition: 'top' | 'bottom' = 'top',
		mean: 0 | 1 = 1
	) {
		const _data = {
			message: _message,
			snackBar: this.snackBar,
			showCloseButton: _showCloseButton,
			showUndoButton: _showUndoButton,
			undoButtonDuration: _undoButtonDuration,
			verticalPosition: _verticalPosition,
			type: _type,
			action: 'Undo',
			meanMes: mean
		};
		return this.snackBar.openFromComponent(ActionNotificationComponent, {
			duration: _duration,
			data: _data,
			verticalPosition: _verticalPosition
		});
	}

	showInfo(
		message: string,
	) {
		let type: MessageType = MessageType.Create,
			duration: number = 100000,
			showCloseButton: boolean = true,
			showUndoButton: boolean = false,
			undoButtonDuration: number = 3000,
			verticalPosition: 'top' | 'bottom' = 'top',
			mean: 0 | 1 = 1
		return this.snackBar.openFromComponent(ActionNotificationComponent, {
			duration: duration,
			data: {
				message,
				snackBar: this.snackBar,
				showCloseButton: showCloseButton,
				showUndoButton: showUndoButton,
				undoButtonDuration,
				verticalPosition,
				type,
				action: 'Undo',
				meanMes: mean
			},
			verticalPosition: verticalPosition
		});
	}


	Notifi(
		_message: string,
	_fullname: string,
	_avatar:string,
		_type: MessageType = MessageType.Create,
		_duration: number = 10000,
		_showCloseButton: boolean = true,
		_showUndoButton: boolean = true,
		_undoButtonDuration: number = 3000,
		_verticalPosition: 'top' | 'bottom' = 'bottom',
		horizontalPosition:'start'='start',
		mean: 0 | 1 = 1
	) {
		const _data = {
			message: _message,
			Fullname:_fullname,
			avatar:_avatar,
			snackBar: this.snackBar,
			showCloseButton: _showCloseButton,
			showUndoButton: _showUndoButton,
			undoButtonDuration: _undoButtonDuration,
			verticalPosition: _verticalPosition,
			horizontalPosition:horizontalPosition,
			type: _type,
			action: 'Undo',
			meanMes: mean
		};
		return this.snackBar.openFromComponent(FetchEntityDialogComponent, {
			duration: _duration,
			data: _data,
			verticalPosition: _verticalPosition,
			horizontalPosition:horizontalPosition
		});
	}
	/**
	 * Showing Confirmation (Mat-Dialog) before Entity Removing
	 *
	 * @param title: stirng
	 * @param description: stirng
	 * @param waitDesciption: string
	 */
   deleteElement(title: string = '', description: string = '', waitDesciption: string = '', doPositiveBtn: string = 'Delete',isDel:boolean = true ) {
		return this.dialog.open(DeleteEntityDialogComponent, {
			data: { title, description, waitDesciption, doPositiveBtn, isDel },
			width: '440px',
			panelClass:'no-padding'
		});
	}

	/**
	 * Showing Fetching Window(Mat-Dialog)
	 *
	 * @param _data: any
	 */
	fetchElements(_data) {
		return this.dialog.open(FetchEntityDialogComponent, {
			data: _data,
			width: '400px'
		});
	}

	/**
	 * Showing Update Status for Entites Window
	 *
	 * @param title: string
	 * @param statuses: string[]
	 * @param messages: string[]
	 */
	updateStatusForEntities(title, statuses, messages) {
		return this.dialog.open(UpdateStatusDialogComponent, {
			data: { title, statuses, messages },
			width: '480px'
		});
	}
	showWaitingDiv() {
		let v_idWaiting: string = 'nemo-process-waiting-id';//id waiting
		let v_idWaitingLoader: string = 'nemo-process-waiting-loader';//id waiting
		let _show: string = 'nemo-show-wait';
		let _hide: string = 'nemo-hide-wait';
		let divWait = document.getElementById(v_idWaiting);
		let loader = document.getElementById(v_idWaitingLoader);
		let message = document.getElementById("titlenetwork");
		if (divWait.classList.contains(_show)) {
			divWait.classList.remove(_show);
			divWait.classList.add(_hide);
			loader.classList.remove(_show);
			loader.classList.add(_hide);
		}
		else {
			if (divWait.classList.contains(_hide)) {
				divWait.classList.remove(_hide);
				divWait.classList.add(_show);
				loader.classList.remove(_hide);
				loader.classList.add(_show);
			}
			else {
				divWait.classList.remove(_show);
				divWait.classList.add(_hide);
				loader.classList.remove(_show);
				loader.classList.add(_hide);
			}
		}
	}

	OffWaitingDiv() {
		let v_idWaiting: string = 'nemo-process-waiting-id';//id waiting
		let v_idWaitingLoader: string = 'nemo-process-waiting-loader';//id waiting
		let _show: string = 'nemo-show-wait';
		let _hide: string = 'nemo-hide-wait';
		let divWait = document.getElementById(v_idWaiting);
		let loader = document.getElementById(v_idWaitingLoader);

		divWait.classList.remove(_show);
		divWait.classList.add(_hide);

		loader.classList.remove(_show);
		loader.classList.add(_hide);

	}
	showWaitingDivInternet() {
		let v_idWaiting: string = 'nemo-process-waiting-id';//id waiting
		let v_idWaitingLoader: string = 'nemo-process-waiting-loader';//id waiting
		let _show: string = 'nemo-show-wait';
		let _hide: string = 'nemo-hide-wait';
		let divWait = document.getElementById(v_idWaiting);
		let loader = document.getElementById(v_idWaitingLoader);
		let message = document.getElementById("titlenetwork");
		if (divWait.classList.contains(_show)) {
			divWait.classList.remove(_show);
			divWait.classList.add(_hide);
			message.style.display="none"
			loader.classList.remove(_show);
			loader.classList.add(_hide);
		}
		else {
			if (divWait.classList.contains(_hide)) {
				divWait.classList.remove(_hide);
				divWait.classList.add(_show);
				message.style.display="block"
				message.innerHTML=`   <div class="wrapper1">
				<div class="circle1"></div>
				<div class="circle1"></div>
				<div class="circle1"></div>
				<div class="shadow"></div>
				<div class="shadow"></div>
				<div class="shadow"></div>
				<span> Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối internet !</span>
			</div>`
				loader.classList.remove(_hide);
				loader.classList.add(_show);
			}
			else {
				divWait.classList.remove(_show);
				divWait.classList.add(_hide);
				message.style.display="none"
				loader.classList.remove(_show);
				loader.classList.add(_hide);
			}
		}
	}

	OffWaitingDivInternet() {
		let v_idWaiting: string = 'nemo-process-waiting-id';//id waiting
		let v_idWaitingLoader: string = 'nemo-process-waiting-loader';//id waiting
		let _show: string = 'nemo-show-wait';
		let _hide: string = 'nemo-hide-wait';
		let message = document.getElementById("titlenetwork");
		let divWait = document.getElementById(v_idWaiting);
		let loader = document.getElementById(v_idWaitingLoader);

		divWait.classList.remove(_show);
		divWait.classList.add(_hide);
		message.style.display="none"
		loader.classList.remove(_show);
		loader.classList.add(_hide);

	}

	ViewDoc(url) {
		return this.dialog.open(DocViewerComponent, {
			data: url,
			width: '95vw'
		});
	}
	ViewDoc2(url,type) {
		return this.dialog.open(DocViewerComponent, {
			data: {url,type},
			width: '95vw'
		});
	}

	showError(
		message: string,
	) {
		let type: MessageType = MessageType.Read,
			duration: number = 100000,
			showCloseButton: boolean = true,
			showUndoButton: boolean = false,
			undoButtonDuration: number = 3000,
			verticalPosition: 'top' | 'bottom' = 'top',
			mean: 0 | 1 = 0
		return this.snackBar.openFromComponent(ActionNotificationComponent, {
			duration: duration,
			data: {
				message,
				snackBar: this.snackBar,
				showCloseButton: showCloseButton,
				showUndoButton: showUndoButton,
				undoButtonDuration,
				verticalPosition,
				type,
				action: 'Undo',
				meanMes: mean
			},
			verticalPosition: verticalPosition
		});
	}
}
