import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentService } from 'src/app/common/services/document.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  storageData: any;
  constructor(
    private router: Router,
    private documentService: DocumentService
  ) { 
    router.events.subscribe(() => {
      let obj:any = localStorage.getItem('loginInfo')
      this.storageData = JSON.parse(obj);
    }); 
  }

  ngOnInit(): void {
    
  }

  signOut() {
    let data: any = localStorage.getItem('loginInfo');
    let obj = {
      id: JSON.parse(data).userId,
      documentAvailability: false
    }
    this.documentService.updateDocumentAvailability(obj).subscribe((res: any) => {});
    localStorage.removeItem('loginInfo');
    this.router.navigate(['/']);
  }

}
