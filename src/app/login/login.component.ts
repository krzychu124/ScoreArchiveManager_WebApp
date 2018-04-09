import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthorizationService } from '@app/shared/service/authorization.service';
import { Logincredentials } from '@app/shared/logincredentials';
import { TokenRequestData } from '@app/shared/service/token-request-data';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  password: FormControl = new FormControl('', Validators.required);
  userName: FormControl = new FormControl('', Validators.required);
  loginStatus: string;
  constructor(private auth: AuthorizationService) { }

  ngOnInit() {
  }

  login() {
    this.auth.login({ userName: this.userName.value, password: this.password.value } as Logincredentials).subscribe(resp => {
      this.loginStatus = 'ok';
    }, err => {
      console.error(err);
      this.loginStatus = 'failed';
    });
  }
  logout() {
    this.auth.logout().subscribe();
  }
}
