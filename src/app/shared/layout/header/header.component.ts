import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  storageData: any;
  constructor(
    private router: Router
  ) { 
    router.events.subscribe(() => {
      let obj:any = localStorage.getItem('loginInfo')
      this.storageData = JSON.parse(obj);
    }); 
  }

  ngOnInit(): void {
    
  }

  signOut() {
    this.router.navigate(['/']);
    localStorage.removeItem('loginInfo');
  }

}
