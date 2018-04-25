import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '@app/shared/service/authorization.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  title = "Witaj ;)";
  constructor(private auth: AuthorizationService) { }

  ngOnInit() {
  }

  isAuthorized(): boolean {
    return this.auth.isAuthenticated();
  }
  
  logout() {
    this.auth.logout().subscribe();
  }
  isAdmin() {
    return this.auth.hasAuthority('ROLE_ADMIN');
  }
 hasOrchestraAccess() {
  return this.auth.hasAuthority('orch_read');
  }
  hasBandAccess() {
    return this.auth.hasAuthority('jbb_read');
  }
}
