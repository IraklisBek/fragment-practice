import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHandler, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AuthModule } from './components/auth/auth.module';
import { PostCreateComponent } from './components/posts/post-create/post-create.component';
import { PostListComponent } from './components/posts/post-list/post-list.component';
import { FragmentLibComponent } from './fragment-lib.component';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatCardModule } from '@angular/material/card'
// import { MatDialogModule } from '@angular/material/dialog'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatInputModule } from '@angular/material/input'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatToolbarModule } from '@angular/material/toolbar'
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PostViewComponent } from './components/posts/post-view/post-view.component';
import { DpDatePickerModule } from 'ng2-date-picker';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { ToastrModule } from 'ngx-toastr';
import { PostLikeComponent } from './components/posts/post-like/post-like.component';
import { FiltersComponent } from './components/filters/filters.component';
import { GeneralService } from './services/general.service';
import { SupportComponent } from './components/modals/support/support.component';
import { AuthInterceptor } from './components/auth/auth-interceptor';
import { ErrorComponent } from './components/error/error.component';
import { ErrorInterceptor } from './services/error-interceptor';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    FragmentLibComponent,
    PostCreateComponent,
    PostListComponent,
    PostViewComponent,
    PostLikeComponent,
    FiltersComponent,
    SupportComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AuthModule,
    GooglePlaceModule,
    DpDatePickerModule,
    RouterModule,
    MatDialogModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton: true
    }),
  ], 
  providers: [
    HttpClient,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}, 
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    // {provide: HTTP_INTERCEPTORS, useClass: MatDialog, multi: true}
  ],
  exports: [
    FragmentLibComponent,
    PostCreateComponent,
    PostListComponent,
    FiltersComponent,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class FragmentLibModule { }
