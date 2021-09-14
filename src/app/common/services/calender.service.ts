import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CalenderService {

  constructor(
    private httpClient: HttpClient
  ) { }

  addEvent(data:any) {
    return this.httpClient.post(`${environment.API_URL}/api/createMeeting`, data);
  }

  getEventList(data:any) {
    return this.httpClient.post(`${environment.API_URL}/api/listOfEvent`, data);
  }

  updateEvent(data:any) {
    return this.httpClient.post(`${environment.API_URL}/api/updateMeeting`, data);
  }

  getAllUser() {
    return this.httpClient.get(`${environment.API_URL}/api/findAllUsers`);
  }

  deleteEvent(id:any) {
    return this.httpClient.delete(`${environment.API_URL}/api/deleteEvent/${id}`);
  }

}
