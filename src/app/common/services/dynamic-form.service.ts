import { Injectable } from '@angular/core';
import { DynamicFormDetail } from '../models/dynamic-form-detail.model';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {

  constructor() { }

  getLocalStorage(key:string) {
    return localStorage.getItem(key);
  }

  setLocalStorage(key:string, value:any) {
    return localStorage.setItem(key, value);
  }

  filterBy() {
    let obj: any = this.getLocalStorage("dynamicQuestion");
    let filterArry:DynamicFormDetail[] = [];
    filterArry = !!obj ? JSON.parse(obj) : [];
    return filterArry;
  }

  createFormDetail(finalObject: any, detailQuestionObj:DynamicFormDetail[], tableArray:DynamicFormDetail[]): DynamicFormDetail[] {
    let obj: any =  this.getLocalStorage("dynamicQuestion");
    finalObject.id = !!obj ? JSON.parse(obj)[JSON.parse(obj).length - 1].id + 1 : 1;
    finalObject.question = tableArray
    delete finalObject.questionType;
    delete finalObject.option;
    detailQuestionObj.push(finalObject);
    this.setLocalStorage("dynamicQuestion", JSON.stringify(detailQuestionObj));
    return detailQuestionObj;
  }

  createDynamicQuestion(finalObject: any) {
    let obj: any =  this.getLocalStorage("questionList");
    let arry:any[] = !!obj ? JSON.parse(obj) : [];
    if (arry.length > 0) {
      let findIndex = arry.findIndex(x => x.id == finalObject.id);
      if (findIndex != -1) {
        arry.splice(findIndex, 1);
      }
    }
    arry.push(finalObject);
    this.setLocalStorage("questionList", JSON.stringify(arry));
  }
}
