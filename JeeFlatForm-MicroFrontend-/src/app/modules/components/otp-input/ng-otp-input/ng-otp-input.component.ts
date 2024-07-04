import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  Inject
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { KeysPipe } from '../pipes/keys.pipe';
import { Config } from '../models/config';
import { KeyboardUtil } from '../utils/keyboard-util';
import { DOCUMENT } from '@angular/common';
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'ng-otp-input',
  templateUrl: './ng-otp-input.component.html',
  styleUrls: ['./ng-otp-input.component.scss']
})
export class NgOtpInputComponent implements OnInit, AfterViewInit {
  @Input() config: Config = { length: 4 };
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onInputChange = new EventEmitter<string>();
  @Input() formCtrl:FormControl;
  otpForm: FormGroup;
  currentVal:string;
  inputControls: FormControl[] = new Array(this.config.length);
  componentKey =
    Math.random()
      .toString(36)
      .substring(2) + new Date().getTime().toString(36);
  get inputType(){
    return this.config?.isPasswordInput
    ? 'password'
    : this.config?.allowNumbersOnly
      ? 'tel'
      : 'text';
  }
  constructor(private keysPipe: KeysPipe,@Inject(DOCUMENT) private document: Document) {}

  ngOnInit() {
    this.otpForm = new FormGroup({});
    for (let index = 0; index < this.config.length; index++) {
      this.otpForm.addControl(this.getControlName(index), new FormControl());
    }
    this.otpForm.valueChanges.subscribe((v:object)=>{
      this.keysPipe.transform(this.otpForm.controls).forEach((k) => {
        var val = this.otpForm.controls[k].value;
        if(val && val.length>1){
          if (val.length >= this.config.length) {
            this.setValue(val);
          }else{
            this.rebuildValue();
          }
        }
      });
    });
  }

  ngAfterViewInit(): void {
    if (!this.config.disableAutoFocus) {
      const containerItem = this.document.getElementById(`c_${this.componentKey}`);
      if (containerItem) {
        const ele: any = containerItem.getElementsByClassName('otp-input')[0];
        if (ele && ele.focus) {
          ele.focus();
        }
      }
    }
  }
  private getControlName(idx) {
    return `ctrl_${idx}`;
  }

  onKeyDown($event, inputIdx){
    const prevInputId = this.getBoxId(inputIdx - 1);
    const currentInputId = this.getBoxId(inputIdx);
    if (KeyboardUtil.ifSpacebar($event)) {
      $event.preventDefault();
      return false;
     }
     if (KeyboardUtil.ifBackspace($event)) {
      if(!$event.target.value){
        this.clearInput(prevInputId,inputIdx-1);
        this.setSelected(prevInputId);
      }else{
        this.clearInput(currentInputId,inputIdx);
      }
      this.rebuildValue();
      return;
    }
  }
  onInput($event){
    let newVal=this.currentVal ? `${this.currentVal}${$event.target.value}` : $event.target.value;
    if(this.config.allowNumbersOnly && !this.validateNumber(newVal)){
      $event.target.value='';
      $event.stopPropagation();
      $event.preventDefault();
      return;
    }
  }


  onKeyUp($event, inputIdx) {
    if(KeyboardUtil.ifTab($event)){
      inputIdx-=1;
    }
    const nextInputId = this.getBoxId(inputIdx + 1);
    const prevInputId = this.getBoxId(inputIdx - 1);
    const currentInputId = this.getBoxId(inputIdx);
    if (KeyboardUtil.ifRightArrow($event)) {
      $event.preventDefault();
      this.setSelected(nextInputId);
      return;
    }
    if (KeyboardUtil.ifLeftArrow($event)) {
      $event.preventDefault();
      this.setSelected(prevInputId);
      return;
    }
    if (KeyboardUtil.ifDelete($event)) {
      if(!$event.target.value){
        this.clearInput(prevInputId,inputIdx-1);
        this.setSelected(prevInputId);
      }else{
        this.clearInput(currentInputId,inputIdx);
      }
      this.rebuildValue();
      return;
    }

    if (!$event.target.value) {
      return;
    }

    if (this.ifValidKeyCode($event)) {
      this.setSelected(nextInputId);
    }
    this.rebuildValue();
  }

  validateNumber(val){
    return val && /^[0-9]+$/.test(val);
  }

  getBoxId(idx:string | number){
    return `otp_${idx}_${this.componentKey}`;
  }

 private clearInput(eleId:string,inputIdx){
    let ctrlName=this.getControlName(inputIdx);
    this.otpForm.controls[ctrlName]?.setValue(null);
    const ele=this.document.getElementById(eleId);
    if(ele && ele instanceof HTMLInputElement){
      ele.value=null;
    }
  }

 private setSelected(eleId) {
    this.focusTo(eleId);
    const ele: any = this.document.getElementById(eleId);
    if (ele && ele.setSelectionRange) {
      setTimeout(() => {
        ele.setSelectionRange(0, 1);
      }, 0);
    }
  }

 private ifValidKeyCode(event) {
    const inp = event.key;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    return (
      isMobile ||
      /[a-zA-Z0-9-_]/.test(inp)
    );
  }

  focusTo(eleId) {
    const ele: any = this.document.getElementById(eleId);
    if (ele) {
      ele.focus();
    }
  }

  // method to set component value
  setValue(value: any) {
    if (this.config.allowNumbersOnly && isNaN(value)) {
        return;
    }
    this.otpForm.reset();
     if (!value) {
       this.rebuildValue();
       return;
     }
     value = value.toString().replace(/\s/g, ''); // remove whitespace
     Array.from(value).forEach((c, idx) => {
          if (this.otpForm.get(this.getControlName(idx))) {
            this.otpForm.get(this.getControlName(idx)).setValue(c);
          }
     });
     if (!this.config.disableAutoFocus) {
      const containerItem = this.document.getElementById(`c_${this.componentKey}`);
      var indexOfElementToFocus = value.length < this.config.length ? value.length : (this.config.length - 1);
      let ele : any = containerItem.getElementsByClassName('otp-input')[indexOfElementToFocus];
      if (ele && ele.focus) {
        ele.focus();
      }
     }
     this.rebuildValue();
  }

private rebuildValue() {
    let val = '';
    this.keysPipe.transform(this.otpForm.controls).forEach(k => {
      if (this.otpForm.controls[k].value) {
        let ctrlVal=this.otpForm.controls[k].value;
        let isLengthExceed=ctrlVal.length>1;
        let isCaseTransformEnabled= !this.config.allowNumbersOnly && this.config.letterCase && (this.config.letterCase.toLocaleLowerCase() == 'upper' || this.config.letterCase.toLocaleLowerCase()== 'lower');
        ctrlVal=ctrlVal[0];
        let transformedVal=isCaseTransformEnabled ? this.config.letterCase.toLocaleLowerCase() == 'upper' ? ctrlVal.toUpperCase() : ctrlVal.toLowerCase()  : ctrlVal;
        if(isCaseTransformEnabled && transformedVal == ctrlVal){
          isCaseTransformEnabled=false;
        }else{
          ctrlVal=transformedVal;
        }
        val += ctrlVal;
        if(isLengthExceed || isCaseTransformEnabled)
        {
         this.otpForm.controls[k].setValue(ctrlVal);
        }
      }
    });
    if(this.formCtrl?.setValue){
      this.formCtrl.setValue(val);
    }
    this.onInputChange.emit(val);
    this.currentVal=val;
  }


  handlePaste(e) {
    // Get pasted data via clipboard API
    let clipboardData = e.clipboardData || window['clipboardData'];
    if(clipboardData){
     var pastedData =clipboardData.getData('Text');
    }
    // Stop data actually being pasted into div
    e.stopPropagation();
    e.preventDefault();
    if (!pastedData || (this.config.allowNumbersOnly && !this.validateNumber(pastedData))) {
      return;
    }
    this.setValue(pastedData);
  }
}
