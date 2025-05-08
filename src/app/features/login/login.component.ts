import { Component } from '@angular/core';
import {LoginFormComponent} from './login-form/login-form.component';
import {LoginService} from './services/login.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login2',
  imports: [
    LoginFormComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private readonly loginService: LoginService, private router: Router) { }

  ngOnInit() {
    if (this.loginService.isAuthenticated()) {
      console.log('User is already logged in');
      this.router.navigate(['/chat']);
    }
  }
}
