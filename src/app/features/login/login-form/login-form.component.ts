import {Component, forwardRef, Inject, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CreateUserDto} from '../dto/create-user-dto';
import {LoginService} from '../services/login.service';
import {UserStatusResponseDto} from '../dto/user-status-response-dto';
import {ErrorDto} from '../../../core/dto/error-dto';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
})
export class LoginFormComponent {
  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private readonly loginService: LoginService) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const formData: CreateUserDto = <CreateUserDto> this.loginForm.value;

      this.loginService.login(formData).subscribe({
        next: (response: string) => {
          const message: string = `Login successful. Token: ${response}`;
          console.log(message);
          alert(message);
        },
        error: (error: ErrorDto) => {
          const message: string = `Login failed. Error: ${error.error}`;
          console.log(message);
          alert(message);
        }
      })
    } else {
      alert('Data is invalid');
    }
  }
}
