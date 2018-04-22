import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthorizationService } from '@app/shared/service/authorization.service';
import { Logincredentials } from '@app/shared/logincredentials';
import { TokenRequestData } from '@app/shared/service/token-request-data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  password: FormControl = new FormControl('', Validators.required);
  userName: FormControl = new FormControl('', Validators.required);
  loginForm: FormGroup;
  loginStatus: string;
  processing: boolean;
  constructor(private auth: AuthorizationService, private router: Router) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      password: this.password,
      userName: this.userName
    });
  }

  login() {
    this.processing = true;
    this.auth.login({ userName: this.userName.value, password: this.password.value } as Logincredentials).subscribe(resp => {
      this.processing = false;
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 500);
    }, err => {
      console.error(err);
      if (err.status === 0) {
        this.loginStatus = 'Błąd połączenia z serwerem...';
      } else {
        this.loginStatus = 'Nieprawidłowy login/hasło';
      }
      this.processing = false;
      setTimeout(() => {
        this.loginStatus = null;
      }, 3000);
    });
  }
}
