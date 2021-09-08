import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DynamicFormDetail } from 'src/app/common/models/dynamic-form-detail.model';
import { UserDetail } from 'src/app/common/models/user-detail.model';
import { DetailService } from 'src/app/common/services/detail.service';
import { DynamicFormService } from 'src/app/common/services/dynamic-form.service';


@Component({
  selector: 'app-detail-form',
  templateUrl: './detail-form.component.html',
  styleUrls: ['./detail-form.component.scss']
})
export class DetailFormComponent implements OnInit {

  @Input() public detailObj: UserDetail[] = [];
  @Input() public detailQuestionObj: DynamicFormDetail[] = [];
  @Input() public fromPage!: string;
  @Input() public finalGeneratedFormObj!: DynamicFormDetail;
  @Output() dismissPopup: EventEmitter<any> = new EventEmitter();
  detailForm!: FormGroup;
  dynamicDetailForm!: FormGroup;
  questionDetailForm!: FormGroup;
  dateStruc!: NgbDateStruct;
  tableArray: DynamicFormDetail[] = [];
  dynamicQuestionList: any[] = [];
  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private detailService: DetailService,
    private dynamicFormService: DynamicFormService
  ) { }

  ngOnInit(): void {
    let obj: any =  this.dynamicFormService.getLocalStorage("questionList");
    this.dynamicQuestionList = !!obj ? JSON.parse(obj) : [];
    this.buildForms();
  }


  buildForms() {
    if (this.fromPage === 'detailPage') {
      this.detailForm = this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
        age: ['', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]]
      });
    }
    if (this.fromPage === 'dynamicFormPage') {
      this.dynamicDetailForm = this.formBuilder.group({
        formName: ['', Validators.required],
        question: ['', Validators.required],
        questionType: ['', Validators.required],
        option: this.formBuilder.array([this.createField()])
      });
    }
    if (this.fromPage === 'finalForm') {
      let formQuestionObject:any = {};
      if (this.dynamicQuestionList.length > 0) {
        formQuestionObject = this.dynamicQuestionList.find(x => x.id == this.finalGeneratedFormObj.id);
      }
      let check = (!!formQuestionObject && JSON.stringify(formQuestionObject) != '{}')
      let fbObj = {};
      let obj: any = {};
      let keyvalue = '';
      for (let i = 0; this.finalGeneratedFormObj.question.length > i; i++) {
        switch (Number(this.finalGeneratedFormObj.question[i].questionType)) {
          case 1:
            keyvalue = 'short' + i.toString();
            obj = {}
            obj[keyvalue] = [check ? formQuestionObject.question[keyvalue] : '']
            fbObj = { ...fbObj, ...obj }
            break;
          case 2:
            keyvalue = 'long' + i.toString();
            obj = {}
            obj[keyvalue] = [check ? formQuestionObject.question[keyvalue] : '']
            fbObj = { ...fbObj, ...obj }
            break;
          case 3:
            keyvalue = 'checkBox' + i.toString();
            obj = {}
            obj[keyvalue] = check 
            ? this.formBuilder.array(formQuestionObject.question[keyvalue].map((x:any) => x))
            : this.formBuilder.array(this.finalGeneratedFormObj.question[i].option.map((x:any) => false));
            fbObj = { ...fbObj, ...obj }
            break;
          case 4:
            keyvalue = 'radio' + i.toString();
            obj = {}
            obj[keyvalue] = [check ? formQuestionObject.question[keyvalue] : '']
            fbObj = { ...fbObj, ...obj }
            break;
          case 5:
            keyvalue = 'date' + i.toString();
            obj = {}
            obj[keyvalue] = [''] 
            fbObj = { ...fbObj, ...obj }
            break;
          default:
            console.log('Nothing to do');
            break;
        }
      }
      this.questionDetailForm = this.formBuilder.group(fbObj);
      setTimeout(() => {
        if (check) {
          for (let i = 0; this.finalGeneratedFormObj.question.length > i; i++) {
            if (this.finalGeneratedFormObj.question[i].questionType == 5) {
              keyvalue = 'date' + i.toString();
              this.questionDetailForm.controls[keyvalue].setValue(formQuestionObject.question[keyvalue])
            }  
          }
        }
        console.log('formmmm', this.questionDetailForm.value);
      }, 500);
    
    }
  }

  createField() {
    return this.formBuilder.group({
      textValue: ['']
    });
  }

  get f() {
    return this.dynamicDetailForm.controls;
  }

  get formArrayControll(): FormArray {
    return this.f.option as FormArray;
  }


  close() {
    this.modalService.dismissAll();
  }

  submit(addList?: boolean): any {
    if (this.fromPage === 'detailPage') {
      if (!this.detailForm.valid) {
        this.detailForm.markAllAsTouched();
        return false;
      }
      let finalObject: UserDetail = Object.assign({}, this.detailForm.value);
      let returnValue = this.detailService.createDetail(finalObject, this.detailObj);
      this.dismissPopup.emit(returnValue);
    }

    if (this.fromPage === 'dynamicFormPage') {
      if ((this.f.questionType.value == 3 || this.f.questionType.value == 4)) {
        this.formArrayControll.controls.map((contro: any) => {
          if (contro['controls']['textValue'].value == "") {
            contro['controls']['textValue'].setValidators([Validators.required]);
            contro['controls']['textValue'].updateValueAndValidity();
            contro['controls']['textValue'].setErrors({ required: true });
            this.formArrayControll.markAllAsTouched();
          } else {
            this.formArrayControll.controls.map((contro: any) => {
              contro['controls']['textValue'].setValidators(null);
              contro['controls']['textValue'].updateValueAndValidity();
              contro['controls']['textValue'].setErrors(null);
            });
          }

        });
      } else {
        this.formArrayControll.controls.map((contro: any) => {
          contro['controls']['textValue'].setValidators(null);
          contro['controls']['textValue'].updateValueAndValidity();
          contro['controls']['textValue'].setErrors(null);
        });
      }
      if (!this.dynamicDetailForm.valid && !!addList) {
        this.dynamicDetailForm.markAllAsTouched();
        return false;
      }
      if ((!!this.formArrayControll && !this.formArrayControll.valid) && (this.f.questionType.value == 3 || this.f.questionType.value == 4)) {
        this.formArrayControll.markAllAsTouched();
        return false;
      }
      if ((this.f.questionType.value != 3 && this.f.questionType.value != 4)) {
        delete this.dynamicDetailForm.value.option;
      }
      let finalObject: DynamicFormDetail = Object.assign({}, this.dynamicDetailForm.value);
      if (!!addList && addList) {
        this.tableArray.push(finalObject);
        this.f.question.reset();
        this.f.questionType.reset();
      } else {
        let returnValue = this.dynamicFormService.createFormDetail(finalObject, this.detailQuestionObj, this.tableArray);
        this.dismissPopup.emit(returnValue);
        this.tableArray = [];
      }
    }

    if (this.fromPage === 'finalForm') {
      let obj = {
        id: this.finalGeneratedFormObj.id,
        question: this.questionDetailForm.value
      }
      this.dynamicFormService.createDynamicQuestion(obj);
    }
    if (addList == undefined) {
      this.close();
    }
  }

  addOption(): any {
    this.formArrayControll.controls.map((contro: any) => {
      if (contro['controls']['textValue'].value == "") {
        contro['controls']['textValue'].setValidators([Validators.required]);
        contro['controls']['textValue'].updateValueAndValidity();
        contro['controls']['textValue'].setErrors({ required: true });
        this.formArrayControll.markAllAsTouched();
      } else {
        this.formArrayControll.controls.map((contro: any) => {
          contro['controls']['textValue'].setValidators(null);
          contro['controls']['textValue'].updateValueAndValidity();
          contro['controls']['textValue'].setErrors(null);
        });
      }
    });

    if (!this.formArrayControll.valid) {
      this.formArrayControll.markAllAsTouched();
      return false;
    }
    this.formArrayControll.push(this.createField());
  }

  changeQuestionType(event: any) {
    this.formArrayControll.controls = [];
    if (event.target.value === "3") {
      this.formArrayControll.push(this.createField());
    }
    if (event.target.value === "4") {
      this.formArrayControll.push(this.createField());
      this.formArrayControll.push(this.createField());
    }
  }

  deleteOption(index: number) {
    this.formArrayControll.removeAt(index);
  }

  deleteFromQuestionList(index: number) {
    this.tableArray.splice(index, 1);
  }

  identify(index: any) {
    return index;
  }
}
