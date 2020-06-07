/* eslint-disable no-unused-vars */

import { Routes } from '@angular/router';

import { InfoComponent } from './info/info.component';
import { UploadComponent } from './upload/upload.component';
import { AccountLoginComponent } from './account/login/account-login.component';
import { AccountCreateComponent } from './account/create/account-create.component';
import { AccountProfileComponent } from './account/profile/account-profile.component';
import { MomentIndexComponent } from './moment-index/moment-index.component';
import { MomentDetailComponent } from './moment-detail/moment-detail.component';
import { OAuthCallbackComponent } from './oauth-callback/oauth-callback.component';

export const AppRoutes: Routes  = [
  {
    path: 'info', component: InfoComponent
  },
  {
    path: 'upload', component: UploadComponent
  },
  {
    path: 'account/login', component: AccountLoginComponent
  },
  {
    path: 'account/create', component: AccountCreateComponent
  },
  {
    path: 'account/profile', component: AccountProfileComponent
  },
  {
    path: 'm/:id', component: MomentDetailComponent
  },
  {
    path: 'oauthcallback/:provider', component: OAuthCallbackComponent
  },
  {
    path: '',
    component: MomentIndexComponent
  }
];
