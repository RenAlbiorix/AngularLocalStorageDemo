import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import 'moment/locale/pt-br';
import { ToastrService } from 'ngx-toastr';
import { CalenderService } from 'src/app/common/services/calender.service';
import { CalenderPopupComponent } from '../calender-popup/calender-popup.component';

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.scss']
})
export class CalenderComponent implements OnInit {
  daysArry: any[] = [];
  timeTemp: any[] = [];
  time: any = ['00:15', '00:30', '00:45', '01:00', '01:15', '01:30', '01:45', '02:00', '02:15', '02:30', '02:45', '03:00', '03:15', '03:30', '03:45', '04:00', '04:15', '04:30', '04:45', '05:00', '05:15', '05:30', '05:45', '06:00', '06:15', '06:30', '06:45', '07:00', '07:15', '07:30', '07:45', '08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45', '21:00', '21:15', '21:30', '21:45', '22:00', '22:15', '22:30', '22:45', '23:00', '23:15', '23:30', '23:45', '24:00'];
  localData!: any;
  eventTitleList: any[] = [];
  userList: any[] = [];
  userFilterId: any[] = [];
  typeFilterArry: any[] = [];
  createdByFilterArry: any[] = [];

  eventTypes = [
    {
      text: 'Technical',
      value: 'technical'
    },
    {
      text: 'Non Technical',
      value: 'nonTechnical'
    },
    {
      text: "Don't Know",
      value: 'dontKnow'
    }
  ]

  constructor(
    private modalService: NgbModal,
    private calenderService: CalenderService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    let obj: any = localStorage.getItem('loginInfo');
    this.localData = JSON.parse(obj);
    this.timeSlot();
    this.getEventList();
    this.calenderService.getAllUser().subscribe((res: any) => {
      this.userList = res.data;
    });
  }

  getEventList() {
    let obj = {
      userIds: this.userFilterId,
      types: this.typeFilterArry,
      createdBy: this.createdByFilterArry
    }
    this.calenderService.getEventList(obj).subscribe((res: any) => {
      this.eventTitleList = res.data;
    }, (err: any) => {
      this.toastr.error(err.error.message);
    });
  }

  userFilter(userId: string, event: any) {
    if (event.currentTarget.checked) {
      this.userFilterId.push(userId);
    } else {
      let index = this.userFilterId.findIndex(x => x == userId);
      if (index != -1) {
        this.userFilterId.splice(index, 1);
      }
    }
    this.getEventList();
  }

  createdByFilter(userId: string, event: any) {
    if (event.currentTarget.checked) {
      this.createdByFilterArry.push(userId);
    } else {
      let index = this.createdByFilterArry.findIndex(x => x == userId);
      if (index != -1) {
        this.createdByFilterArry.splice(index, 1);
      }
    }
    this.getEventList();
  }

  typeFilter(type: string, event: any) {
    if (event.currentTarget.checked) {
      this.typeFilterArry.push(type);
    } else {
      let index = this.typeFilterArry.findIndex(x => x == type);
      if (index != -1) {
        this.typeFilterArry.splice(index, 1);
      }
    }
    this.getEventList();
  }

  timeSlot() {
    let startDate = moment();
    let endDate: any = moment().add(4, 'days');
    let day = startDate;

    while (day <= endDate) {
      this.daysArry.push(day.format('DD/MM'))
      day = day.clone().add(1, 'd')
    }

    this.timeTemp = [];
    this.time.map((time: any, i: number) => {
      let demo: any = {
        'time': time,
        'days': []
      }
      this.timeTemp.push(demo);
      this.daysArry.map(day => {
        let days = {
          'day': day,
          meeting: []
        }
        this.timeTemp[i]['days'].push(days)
      });
    });
  }

  openDialog(event: any, dayIndex: any, timeIndex: any, id: any) {
    let time = this.timeTemp[timeIndex].time;
    let date = this.timeTemp[timeIndex].days[dayIndex].day;
    let obj = {
      calendarData: this.timeTemp,
      dayRecordIndex: dayIndex,
      timeRecordIndex: timeIndex,
      userData: this.userList,
      data: !!this.eventTitleList.find(x => x.dayDate == date && x.dayTime == time && x._id == id)
        ? this.eventTitleList.find(x => x.dayDate == date && x.dayTime == time && x._id == id)
        : ""
    }
    if (id == '' && event.currentTarget.classList.length == 0) {
      event.stopPropagation();
      const ref = this.modalService.open(CalenderPopupComponent, { backdrop: 'static', keyboard: false, modalDialogClass: 'modal-md' });
      ref.componentInstance.calenderObject = obj;
      ref.componentInstance.dismissPopup.subscribe((result: any) => {
        this.getEventList();
      });
      return
    }
    event.stopPropagation();
    const ref = this.modalService.open(CalenderPopupComponent, { backdrop: 'static', keyboard: false, modalDialogClass: 'modal-md' });
    ref.componentInstance.calenderObject = obj;
    ref.componentInstance.dismissPopup.subscribe((result: any) => {
      this.getEventList();
    });
    return
  }

  delete(event: any, item: any) {
    event.stopPropagation();
    this.calenderService.deleteEvent(item._id).subscribe((res: any) => {
      this.toastr.success(res.message);
      this.getEventList();
    }, (err: any) => {
      this.toastr.error(err.error.message);
    });
  }
}

