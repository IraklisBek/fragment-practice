import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, LoginComponent } from '@fragment-lib';
import { PostListComponent } from '@fragment-lib';
import { SignupComponent } from '@fragment-lib';
import { PostViewComponent } from '@fragment-lib';
import { BurgerComponent } from './pages/burger/burger.component';
import { CreateComponent } from './pages/create/create.component';
import { HomeComponent } from './pages/home/home.component';
import { MapComponent } from './pages/map/map.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SearchComponent } from './pages/search/search.component';
import { CanDeactivateGuard } from './services/can-deactivate-guard.service';

//loadchildren makes lazy load, which means will load the code only when i reach the route

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  // { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  // { path: 'create', component: PostCreateComponent, canActivate: [AuthGuard] },
  // { path: 'search', component: SearchComponent, canActivate: [AuthGuard] },
  // { path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard] },
// data: {animation: 'Home'},
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard]},
  { path: 'post/:postId', component: PostViewComponent, canActivate: [AuthGuard]},
  { path: 'create', component: CreateComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard]},
  { path: 'create/:postId', component: CreateComponent, canActivate: [AuthGuard]},
  { path: 'search', component: SearchComponent, canActivate: [AuthGuard]},
  { path: 'burger', component: BurgerComponent, canActivate: [AuthGuard]},
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  { path: 'map', component: MapComponent, canActivate: [AuthGuard]},
  { path: 'post', component: PostViewComponent, canActivate: [AuthGuard]},
  { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard]},
  { path: 'edit/:postId', component: CreateComponent, canActivate: [AuthGuard]},

  // { path: 'auth', loadChildren: './auth/auth.module#AuthModule'},
  { path: 'auth/login', component: LoginComponent},
  { path: 'auth/signup', component: SignupComponent},
];
 
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
//, {scrollPositionRestoration: 'disabled'}