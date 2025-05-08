import {LoginComponent} from './features/login/login.component';
import {ProfileComponent} from './features/profile/profile.component';
import {Routes} from '@angular/router';
import {AuthenticationGuard} from './core/guards/authentication-guard';
import {ChatsComponent} from './features/chats/chats.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'chat',
    component: ChatsComponent,
    canActivate: [AuthenticationGuard]
  }
];
