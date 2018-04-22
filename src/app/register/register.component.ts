import { Component, OnInit } from '@angular/core';
import { RestService } from '@app/shared/service/rest.service';
import { User } from '@app/shared/user';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthorizationService } from '@app/shared/service/authorization.service';
import { Logincredentials } from '@app/shared/logincredentials';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  name: FormControl = new FormControl('', Validators.required);
  surname: FormControl = new FormControl('', Validators.required);
  email: FormControl = new FormControl('', Validators.required);
  password: FormControl = new FormControl('', Validators.required);
  userName: FormControl = new FormControl('', Validators.required);
  registerForm: FormGroup;
  processing: boolean;
  protected error: any;
  constructor(private rest: RestService, private auth: AuthorizationService, private router: Router) { }

  ngOnInit() {
    this.registerForm = new FormGroup({
      name: this.name,
      surname: this.surname,
      email: this.email,
      password: this.password,
      userName: this.userName
    });
  }
  register() {
    this.error = null;
    let user = new User();
    user.name = this.name.value;
    user.surname = this.surname.value;
    user.email = this.email.value;
    user.userName = this.userName.value;
    user.password = this.password.value;
    this.processing = true;
    this.rest.registerUser(user).subscribe(resp => {
      this.processing = false;
      console.info('OK');
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 500);
    }, err => {
      this.processing = false;
      this.error = 'Wystąpił problem podczas rejestracji :(';
      setTimeout(() => {
        this.error = null;
      }, 3000);
      console.info(err);
    });
  }
  login() {
    this.auth.login({ userName: "k", password: "p" } as Logincredentials).subscribe(resp => { console.log(resp); }, err => { console.error(err); });
  }
}
