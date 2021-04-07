import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {FragmentLibModule} from "@fragment-lib";
import { HeaderComponent } from './components/header/header.component';
import { AuthService } from '@fragment-lib';
import { HttpClientModule } from '@angular/common/http';
import { BottomMenuComponent } from './components/bottom-menu/bottom-menu.component';
import { HomeComponent } from './pages/home/home.component';
import { CreateComponent } from './pages/create/create.component';
import { SearchComponent } from './pages/search/search.component';
import { BurgerComponent } from './pages/burger/burger.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { MapComponent } from './pages/map/map.component';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BottomMenuComponent,
    HomeComponent,
    CreateComponent,
    SearchComponent,
    BurgerComponent,
    ProfileComponent,
    MapComponent,
    NotificationsComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FragmentLibModule,
    GooglePlaceModule, 
    FormsModule, 
    ReactiveFormsModule
  ],
  providers: [
    AuthService,
    HttpClientModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
