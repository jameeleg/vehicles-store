import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatToolbarModule} from  '@angular/material/toolbar';
import  {MatButtonModule} from  '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';




import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { SearchInputComponent } from './search-input/search-input.component';

import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { LoaderService } from "./loader.service";
import { LogoutComponent } from './logout/logout.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    SearchInputComponent,
    LogoutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    
  ],
  providers: [
    AuthService,
    AuthGuard,
    LoaderService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
