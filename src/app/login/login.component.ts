import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../common/services/login.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SignUpComponent } from '../sign-up/sign-up.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  errorMessage = "";
  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required,Validators.minLength(8)]]
    });
  }

  signIn() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.loginService.signIn(this.loginForm.value).subscribe((res:any) => {
        let loginInfo = {
          token: res.token,
          userId: res.user._id,
          name: res.user.name
        }
        localStorage.setItem('loginInfo', JSON.stringify(loginInfo))
        this.router.navigate(['/detailPage'])
    }, (err:any) => {
        this.toastr.error(err.error.message);
    });
  }

  signUp() {
    const ref = this.modalService.open(SignUpComponent, { backdrop: 'static', keyboard: false });
  }

}
