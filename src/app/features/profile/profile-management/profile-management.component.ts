import { Component } from '@angular/core';
import {UserStatusResponseDto} from '../../login/dto/user-status-response-dto';
import {ProfileService} from '../services/profile.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CreateUserDto} from '../../login/dto/create-user-dto';
import {ErrorDto} from '../../../core/dto/error-dto';

@Component({
  selector: 'app-profile-management',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './profile-management.component.html',
  styleUrl: './profile-management.component.css'
})
export class ProfileManagementComponent {
  private user: UserStatusResponseDto;
  profileUpdateForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private readonly profileService: ProfileService) {
    this.profileUpdateForm = this.formBuilder.group({
      username: [''],
      password: ['']
    });
    this.user = this.profileService.getUser();
  }

  public getUser(): UserStatusResponseDto {
    return this.user;
  }

  public onSubmit() {
    if (this.profileUpdateForm.valid) {
      const formData: CreateUserDto = <CreateUserDto> this.profileUpdateForm.value;

      this.profileService.updateUser(formData).subscribe({
        next: (response: string) => {
          this.user = this.profileService.getUser();
          const message: string = `Update successful. Token updated: ${response}`;
          console.log(message);
          alert(message);
        },
        error: (error: ErrorDto) => {
          const message: string = `Update failed. Error: ${error.error}`;
          console.log(message);
          alert(message);
        }
      });
    } else {
      alert('Data is invalid');
    }
  }

  public onDeleteProfile() {
    const password: string = prompt('Please enter your password to confirm deletion:') || '';

    this.profileService.deleteUser(password).subscribe({
      next: (response: string) => {
        const message: string = `Profile deletion successful`;
        console.log(message);
        alert(message);
        this.profileService.logOut();
      },
      error: (error: ErrorDto) => {
        const message: string = `Profile deletion failed. Error: ${error.error}`;
        console.log(message);
        alert(message);
      }
    });
  }

  public onLogOut() {
    this.profileService.logOut();
  }
}
