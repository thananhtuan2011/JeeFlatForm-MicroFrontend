import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { RecaptchaComponent } from 'ng-recaptcha';
import { LayoutUtilsService, MessageType } from '../../crud/utils/layout-utils.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpParams } from '@angular/common/http';

enum ErrorStates {
  NotSubmitted,
  HasError,
  NoError,
}

@Component({
  selector: 'app-forgot-password-cancel',
  templateUrl: './forgot-password-cancel.component.html',
  styleUrls: ['./forgot-password-cancel.component.scss'],
})
export class ForgotPasswordCancelComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  errorState: ErrorStates = ErrorStates.NotSubmitted;
  errorStates = ErrorStates;
  isLoading$: Observable<boolean>;
  //========================================================
  public model: any = {
    UserID: '', Code: ''
  };
  ShowError: boolean = false;
  constructor(
    private authService: AuthService,
    private translate: TranslateService,
    private layoutUtilsService: LayoutUtilsService,
    private changeDetectorRefs: ChangeDetectorRef,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    const url = window.location.href;
    if (url.includes('?')) {
      const httpParams = new HttpParams({ fromString: url.split('?')[1] });
      this.model.Code = httpParams.get('id');
      this.model.UserID = httpParams.get('nv');
      if (httpParams.get('action') != "cancel") {
        this.router.navigateByUrl("/");
      }
    }
  }

  submit() {
    this.layoutUtilsService.OnWaitingRouter();
    this.authService.cancelPassword(this.model).subscribe(res => {
      this.layoutUtilsService.OffWaitingRouter();
      if (res && res.status == 1) {
        this.router.navigateByUrl("/");
      } else {
        this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
      }
    });

    this.changeDetectorRefs.detectChanges();
  }
}
