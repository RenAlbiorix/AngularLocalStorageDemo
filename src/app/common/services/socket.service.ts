import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  socket!: Socket;
  constructor() {
    this.socket = io(environment.SOCKET_ENDPOINT, {transports: ["websocket"]});
  }


  on(event:string) {
    return new Observable(observer => {
      this.socket.on(event, msg => {
        observer.next(msg);
      });
    });
  }


  emit(event:string, data:any) {
    this.socket.emit(event, data);
  }

}
