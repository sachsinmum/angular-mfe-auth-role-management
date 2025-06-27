import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MessageService } from 'primeng/api';

import { SharedLayoutModule } from './layout/layout.module';
import { AuthService } from './services/auth.service';
import { MenuService } from './services/menu.service';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

@NgModule({
  imports: [
    CommonModule,
    SharedLayoutModule
  ],
  exports: [
    SharedLayoutModule
  ],
  providers: [
    AuthService,
    MenuService,
    MessageService,
    AuthGuard,
    RoleGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ]
})
export class SharedModule { }
