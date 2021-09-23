import { Component, HostListener, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CalenderService } from 'src/app/common/services/calender.service';
import { DocumentService } from 'src/app/common/services/document.service';
import { SocketService } from 'src/app/common/services/socket.service';
@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit {

  textValue = "";
  subject: Subject<any> = new Subject();
  information: any;
  typingName: any = "";
  availableUserArray: any[] = [];
  constructor(
    private calenderService: CalenderService,
    private socketService: SocketService,
    private documentService: DocumentService,
    private toastr: ToastrService
  ) {
    this.socketService.on("getTyping").subscribe((data: any) => {
      this.typingName = data;
    });

    this.socketService.on("getDocument").subscribe((data: any) => {
      this.textValue = data.message;
      this.information = data;
      this.typingName = "";
    });

    this.socketService.on("getAvailableUser").subscribe((data: any) => {
      this.availableUserArray = [];
      this.availableUserArray = data;
    });

  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event: any): void {
    this.updateDocumentAvailability(false);
  }

  ngOnInit(): void {
    let data: any = localStorage.getItem('loginInfo');
    this.socketService.emit("join", '@albiorix');
    this.updateDocumentAvailability(true);
    this.subject
      .pipe(debounceTime(500))
      .subscribe((res) => {
        let obj = {
          message: res,
          updateBy: JSON.parse(data).name,
          updateTime: new Date().toLocaleString()
        }
        this.socketService.emit("postDocument", obj);
      });
  }

  onKeyUp(): void {
    this.subject.next(this.textValue);
    this.typingName = "";
  }

  onKeyDown() {
    let data: any = localStorage.getItem('loginInfo')
    this.socketService.emit("postTyping", JSON.parse(data).name);
  }

  ngOnDestroy() {
    this.socketService.emit("postTyping", "");
    this.updateDocumentAvailability(false);
  }

  getAllUser() {
    this.calenderService.getAllUser().subscribe((res: any) => {
      this.availableUserArray = res.data.filter((x: any) => x.isDocUserActive);
      this.socketService.emit("postAvailableUser", this.availableUserArray);
    });
  }

  updateDocumentAvailability(flag: boolean) {
    let data: any = localStorage.getItem('loginInfo');
    if (data) {
      let obj = {
        id: JSON.parse(data).userId,
        isDocUserActive: flag
      }
      this.documentService.updateDocumentAvailability(obj).subscribe((res: any) => {
        this.getAllUser();
      }, (err) => {
        this.toastr.error(err);
      });
    } else {
      this.availableUserArray = [];
    }
  }
}


