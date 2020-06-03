import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';

import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { AuthService } from '../auth.service';
import { NotificationsService } from '../notifications.service';
import  {MustMatch} from '../validators/must_match';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  form: FormGroup;
  submitted: boolean = false;
  error: string = "";

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private notifier: NotificationsService,
  ) {}

  ngOnInit() {
    
    const firstNameValidators = [
      Validators.required,
      Validators.minLength(2), // at least 2 chars for name
      Validators.maxLength(25), // Avoid inserting long text
    ]

    const lastNameValidators = [Validators.maxLength(25)]; // avoid too long text

    const emailValidators = [
      Validators.required,
      Validators.email,
      Validators.maxLength(35),   
    ];

    const passwordValidators = [
      Validators.required,
      Validators.minLength(6),
    ];

    const confirmPasswordValidators = [
      Validators.required,
    ];

    this.form = this.formBuilder.group({
      firstName:['', Validators.compose(firstNameValidators)],
      lastName:['', Validators.compose(lastNameValidators)],
      email: ['', Validators.compose(emailValidators)],
      password: ['', Validators.compose(passwordValidators)],
      confirmPassword: ['', Validators.compose(confirmPasswordValidators)],
    },
    {
      validator: MustMatch('password', 'confirmPassword')  
    });
  }


  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.auth.signup(
      this.form.value.firstName,
      this.form.value.lastName,
      this.form.value.email, 
      this.form.value.password,
    )
    .pipe(first())
    .subscribe(
      result => {
        this.notifier.notify('User created successfully' , 'Dismiss')
        this.router.navigate(['home'])
      },
      err => this.notifier.notify(err.error, 'Dismiss', false)
    );
    this.form.reset();
    
  }
}

