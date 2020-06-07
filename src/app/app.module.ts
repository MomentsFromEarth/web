import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule, ActivatedRouteSnapshot } from '@angular/router';

import { FileDropModule } from 'ngx-file-drop/lib/ngx-drop';

import { AppComponent } from './app.component';
import { InfoComponent } from './info/info.component';
import { UploadComponent } from './upload/upload.component';
import { AccountLoginComponent } from './account/login/account-login.component';
import { AccountCreateComponent } from './account/create/account-create.component';
import { AccountProfileComponent } from './account/profile/account-profile.component';
import { MomentIndexComponent } from './moment-index/moment-index.component';
import { MomentDetailComponent } from './moment-detail/moment-detail.component';

import { AppRoutes } from './app.routes';
import { OAuthCallbackComponent } from './oauth-callback/oauth-callback.component';

import { AccountService } from './services/account/account.service';
import { ApiService } from './services/api/api.service';
import { AuthService } from './services/auth/auth.service';
import { CognitoService } from './services/cognito/cognito.service';
import { FacebookService } from './services/facebook/facebook.service';
import { GoogleService } from './services/google/google.service';
import { GravatarService } from './services/gravatar/gravatar.service';
import { LoggerService } from './services/logger/logger.service';
import { MessengerService } from './services/messenger/messenger.service';
import { MomentService } from './services/moment/moment.service';
import { SettingsService } from './services/settings/settings.service';
import { StoreService } from './services/store/store.service';
import { StoreReducer } from './services/store/store.reducer';

import { CookieService } from 'ng2-cookies';

@NgModule({
  declarations: [
    AppComponent,
    InfoComponent,
    MomentIndexComponent,
    UploadComponent,
    MomentDetailComponent,
    OAuthCallbackComponent,
    AccountLoginComponent,
    AccountCreateComponent,
    AccountProfileComponent
  ],
  imports: [
    BrowserModule,
    FileDropModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    RouterModule.forRoot(AppRoutes, { useHash: false })
  ],
  exports: [RouterModule],
  providers: [
    AccountService,
    ApiService,
    AuthService,
    CognitoService,
    CookieService,
    FacebookService,
    GoogleService,
    GravatarService,
    LoggerService,
    MessengerService,
    MomentService,
    SettingsService,
    StoreReducer,
    StoreService
  ],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { 
}
