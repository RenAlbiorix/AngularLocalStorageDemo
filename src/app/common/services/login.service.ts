import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private httpClient: HttpClient
  ) { }


  signIn(data:any) {
    return this.httpClient.post(`${environment.API_URL}/api/user/login`, data);
  }

  signUp(data:any) {
    return this.httpClient.post(`${environment.API_URL}/api/user`, data);
  }
}