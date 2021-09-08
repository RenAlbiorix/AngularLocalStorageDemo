import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserDetail } from 'src/app/common/models/user-detail.model';
import { DetailService } from 'src/app/common/services/detail.service';
import { DetailFormComponent } from '../detail-form/detail-form.component';

@Component({
  selector: 'app-detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.scss']
})
export class DetailPageComponent implements OnInit {
  detailArray: UserDetail[] = [];

  constructor(
    private modalService: NgbModal,
    private detailService: DetailService
    ) { }

  ngOnInit(): void {
    this.detailArray = this.detailService.filterBy("inbox");
  }

  open() {
    const ref = this.modalService.open(DetailFormComponent, { backdrop: 'static', keyboard: false });
    ref.componentInstance.detailObj = this.detailArray;
    ref.componentInstance.fromPage = 'detailPage';
    ref.componentInstance.dismissPopup.subscribe((result: any) => {
      this.detailArray = result;
    });
  }

  inbox() {
    this.detailArray = this.detailService.filterBy("inbox");
  }

  starred() {
    this.detailArray = this.detailService.filterBy("starred");
  }

  trash() {
    this.detailArray = this.detailService.filterBy("trash");
  }

  revertOrUnstarred(item:UserDetail, isFrom:string) {
    this.detailArray = this.detailService.revertFromTrashOrUnstarredFromStarredOrAddFrominboxToStarred(item, isFrom);
  }

  delete(item:UserDetail, isFrom:string) {
    this.detailArray = this.detailService.deleteFromInboxOrDeleteFromStarred(item, isFrom);
  }

  addStarred(item:UserDetail) {
    this.detailArray = this.detailService.revertFromTrashOrUnstarredFromStarredOrAddFrominboxToStarred(item, 'inbox');
  }
}
