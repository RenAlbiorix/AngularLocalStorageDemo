import { Injectable } from '@angular/core';
import { UserDetail } from '../models/user-detail.model';


@Injectable({
  providedIn: 'root'
})
export class DetailService {

  constructor() { }


  getLocalStorage(key:string) {
    return localStorage.getItem(key);
  }

  setLocalStorage(key:string, value:any) {
    return localStorage.setItem(key, value);
  }

  createDetail(finalObject: UserDetail, detailObj:UserDetail[]): UserDetail[] {
    finalObject.isDelete = false;
    finalObject.isStarred = false;
    finalObject.type = 'inbox'
    let obj: any =  this.getLocalStorage("detailStore");
    finalObject.id = !!obj ? JSON.parse(obj)[JSON.parse(obj).length - 1].id + 1 : 1;
    detailObj.push(finalObject);
    this.setLocalStorage("detailStore", JSON.stringify(detailObj));
    return detailObj;
  }

  revertFromTrashOrUnstarredFromStarredOrAddFrominboxToStarred(item:UserDetail, isFrom: string) {
    let obj: any = this.getLocalStorage("detailStore");
    let newArry:UserDetail[] = JSON.parse(obj);
    newArry.map((res:UserDetail) => {
      if (res.id == item.id) {
        if (isFrom == 'trash') {
          res.isDelete = false;
          res.type = 'inbox';
        }
        if (isFrom == 'starred') {
          res.isStarred = false;
          res.type = 'inbox';
        }
        if (isFrom == 'inbox') {
          res.isStarred = true;
          res.type = 'starred';
        }
      }
    });
    this.setLocalStorage("detailStore", JSON.stringify(newArry));
    return this.filterBy(isFrom);
  }

  deleteFromInboxOrDeleteFromStarred(item:UserDetail, isFrom: string) {
    let obj: any = this.getLocalStorage("detailStore");
    let newArry:UserDetail[] = JSON.parse(obj);
    newArry.map((res:UserDetail) => {
      if (res.id == item.id) {
        res.isDelete = true;
        res.type = 'trash';
      }
    });
    this.setLocalStorage("detailStore", JSON.stringify(newArry));
    return this.filterBy(isFrom);
  }

  filterBy(isFrom:string) {
    let obj: any = this.getLocalStorage("detailStore");
    let filterArry:UserDetail[] = [];
    // if (isFrom === 'inbox') {
    //   filterArry = !!obj ? JSON.parse(obj).filter((itm:UserDetail) => !itm.isDelete && !itm.isStarred) : [];
    // }
    // if (isFrom === 'starred') {
    //   filterArry = !!obj ? JSON.parse(obj).filter((itm:UserDetail) => !itm.isDelete && itm.isStarred) : [];
    // }
    // if (isFrom === 'trash') {
    //   filterArry = !!obj ? JSON.parse(obj).filter((itm:UserDetail) => itm.isDelete) : [];
    // }
    filterArry = !!obj ? JSON.parse(obj).filter((itm:UserDetail) => itm.type === isFrom) : [];
    return filterArry;
  }
}
