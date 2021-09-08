import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DynamicFormDetail } from 'src/app/common/models/dynamic-form-detail.model';
import { DynamicFormService } from 'src/app/common/services/dynamic-form.service';
import { DetailFormComponent } from 'src/app/crud-detail/detail-form/detail-form.component';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.scss']
})
export class ListPageComponent implements OnInit {
  dynamicFormArray: DynamicFormDetail[] = [];

  constructor(
    private modalService: NgbModal,
    private dynamicFormService: DynamicFormService
  ) { }

  ngOnInit(): void {
    this.dynamicFormArray = this.dynamicFormService.filterBy();
  }

  openPopup() {
    const ref = this.modalService.open(DetailFormComponent, { backdrop: 'static', keyboard: false });
    ref.componentInstance.fromPage = 'dynamicFormPage';
    ref.componentInstance.detailQuestionObj = this.dynamicFormArray;
    ref.componentInstance.dismissPopup.subscribe((result: any) => {
      this.dynamicFormArray = result;
    });
  }

  preview(item: DynamicFormDetail) {
    const ref = this.modalService.open(DetailFormComponent, { backdrop: 'static', keyboard: false });
    ref.componentInstance.fromPage = 'finalForm';
    ref.componentInstance.finalGeneratedFormObj = item;
  }
}
