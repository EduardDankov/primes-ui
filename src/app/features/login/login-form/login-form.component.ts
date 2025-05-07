import {Component, forwardRef, Inject, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CreateUserDto} from '../dto/create-user-dto';
import {LoginService} from '../services/login.service';
import {UserStatusResponseDto} from '../dto/user-status-response-dto';
import {ErrorDto} from '../../../core/dto/error-dto';
import {Router} from '@angular/router';

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

  constructor(private formBuilder: FormBuilder, private readonly loginService: LoginService, private router: Router) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const formData: CreateUserDto = <CreateUserDto> this.loginForm.value;
      this.login(formData);
    } else {
      alert('Data is invalid');
    }
  }

  private login(createUserDto: CreateUserDto): void {
    this.loginService.login(createUserDto).subscribe({
      next: (response: string) => {
        const message: string = `Login successful. Token: ${response}`;
        console.log(message);
        alert(message);
        this.router.navigate(['/profile']);
      },
      error: (error: ErrorDto) => {
        const message: string = `Login failed. Error: ${error.error}. Do you want to register?`;
        console.log(message);
        if (confirm(message)) {
          this.register(createUserDto);
        }
      }
    });
  }

  private register(createUserDto: CreateUserDto): void {
    this.loginService.createUser(createUserDto).subscribe({
      next: (response: string) => {
        const message: string = `Registration successful. Token: ${response}`;
        console.log(message);
        alert(message);
        this.router.navigate(['/profile']);
      },
      error: (error: ErrorDto) => {
        const message: string = `Registration failed. Error: ${error.error}`;
        console.log(message);
        alert(message);
      }
    });
  }
}
