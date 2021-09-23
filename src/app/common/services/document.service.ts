import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(
    private httpClient: HttpClient
  ) { }


  updateDocumentAvailability(data:any) {
    return this.httpClient.post(`${environment.API_URL}/api/updateDocumentAvailability`, data);
  }

}
