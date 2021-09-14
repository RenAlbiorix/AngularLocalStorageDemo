import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CalenderService } from 'src/app/common/services/calender.service';


@Component({
  selector: 'app-calender-popup',
  templateUrl: './calender-popup.component.html',
  styleUrls: ['./calender-popup.component.scss']
})
export class CalenderPopupComponent implements OnInit {

  @Input() calenderObject: any;
  @Output() dismissPopup: EventEmitter<any> = new EventEmitter();
  titleTableArry: any[] = [];
  localData!: any;
  eventForm!: FormGroup;
  constructor(
    private modalService: NgbModal,
    private calenderService:CalenderService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    let obj:any = localStorage.getItem('loginInfo');
    this.localData = JSON.parse(obj);
    this.bindForm();
  }

  bindForm() {
    this.eventForm = this.formBuilder.group({
      eventName: [this.calenderObject.data != "" ? this.calenderObject.data.eventName : "", [Validators.required]],
      description: [this.calenderObject.data != "" ? this.calenderObject.data.description : "", [Validators.required]],
      eventType: [this.calenderObject.data != "" ? this.calenderObject.data.eventType : 'technical', [Validators.required]],
      user: [this.calenderObject.data != "" ? this.calenderObject.data.userId : '', [Validators.required]]
    });
  }

  close() {
    this.modalService.dismissAll();
  }

  submit(): any {
    if (!this.eventForm.valid) {
      this.eventForm.markAllAsTouched();
      return false;
    }
   // let arry:any[] = [];
   // this.titleTableArry.map(item => {
    let obj:any = {}
    let API:any
     if(this.calenderObject.data == "") {
      obj = {
        dayDate: this.calenderObject.calendarData[this.calenderObject.timeRecordIndex]?.days[this.calenderObject.dayRecordIndex]?.day,
        dayTime: this.calenderObject.calendarData[this.calenderObject.timeRecordIndex].time,
        eventName: this.eventForm.value.eventName,
        description: this.eventForm.value.description,
        eventType: this.eventForm.value.eventType,
        userId: this.eventForm.value.user,
        createdBy: this.localData.userId
      }
      API = this.calenderService.addEvent([obj])
     } else {
      obj = {
        eventName: this.eventForm.value.eventName,
        description: this.eventForm.value.description,
        eventType: this.eventForm.value.eventType,
        id: this.calenderObject.data._id
      }
      API = this.calenderService.updateEvent(obj)
     }
      
      //arry.push(obj);
 //   });
    
    API.subscribe((res:any) => {
      if (!res.error) {
        this.toastr.success(res.message);
        this.close();
        this.dismissPopup.emit(res.data);
      }
    }, (err:any) => {
      this.toastr.error(err.error.message);
    });
  }

  addTitle() {
    this.titleTableArry.push('');
  }

  delete(index:any) {
    this.titleTableArry.splice(index,1);
  }
}
