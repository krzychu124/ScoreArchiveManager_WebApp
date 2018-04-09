import { Component, OnInit } from '@angular/core';
import { RestService } from '@app/shared/service/rest.service';
import { User } from '@app/shared/user';
import { FormControl, Validators } from '@angular/forms';
import { AuthorizationService } from '@app/shared/service/authorization.service';
import { Logincredentials } from '@app/shared/logincredentials';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  name: FormControl=new FormControl('', Validators.required);
  surname: FormControl=new FormControl('', Validators.required);
  email: FormControl=new FormControl('', Validators.required);
  password: FormControl=new FormControl('', Validators.required);
  userName: FormControl=new FormControl('', Validators.required);
protected error: any;
  constructor(private rest: RestService, private auth:AuthorizationService) { }

  ngOnInit() {
  }
  register(){
    this.error = null;
    let user = new User();
    user.name = this.name.value;
    user.surname = this.surname.value;
    user.email = this.email.value;
    user.userName = this.userName.value;
    user.password = this.password.value;
    this.rest.registerUser(user).subscribe(resp=> {
      console.info('Registered? ' + resp);
    }, err=> {
      this.error = 'Registration failed';
      console.info('Registered? ' + err);
    });
  }
  login(){
    this.auth.login({userName: "k", password: "p"} as Logincredentials).subscribe(resp => {console.log(resp);}, err => {console.error(err);});
  }
}
