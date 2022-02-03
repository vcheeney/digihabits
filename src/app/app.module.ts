// Importation des modules angular
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

// Importation de mes modules
import { AboutModule } from './about/about.module';
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './auth/auth.module';
import { AuthorModule } from './author/author.module';
import { ContactModule } from './contact/contact.module';
import { CoreModule } from './core/core.module';
import { DevelopmentModule } from './development/development.module';
import { HabitModule } from './habit/habit.module';
import { SharedModule } from './shared/shared.module';

// Importation des components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { ErrorComponent } from './error/error.component';

// Importation des intercepteurs
import { HttpErrorInterceptor } from './http-error.interceptor';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ConfirmationComponent } from './shared/confirmation/confirmation.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, SettingsComponent, ErrorComponent, ConfirmationComponent],
  imports: [
    HttpClientModule,
    BrowserModule,
    AboutModule,
    AppRoutingModule,
    AuthModule,
    AuthorModule,
    ContactModule,
    DevelopmentModule,
    HabitModule,
    CoreModule,
    SharedModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent, ConfirmationComponent]
})
export class AppModule {}
