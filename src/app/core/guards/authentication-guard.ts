import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {LoginService} from '../../features/login/services/login.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private readonly loginService: LoginService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    return this.loginService.isAuthenticated();
  }
}
