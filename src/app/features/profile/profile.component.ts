import { Component } from '@angular/core';
import {ProfileManagementComponent} from './profile-management/profile-management.component';

@Component({
  selector: 'app-profile',
  imports: [
    ProfileManagementComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
}
