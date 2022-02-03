// Importation des modules Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Importation de mes modules
import { AngularMaterialModule } from './angular-material.module';

// Importation de nos components
import { SnackbarNotificationComponent } from './snackbar-notification/snackbar-notification.component';

@NgModule({
  declarations: [SnackbarNotificationComponent],
  exports: [CommonModule, FormsModule, ReactiveFormsModule, AngularMaterialModule, RouterModule, SnackbarNotificationComponent],
  providers: [],
  entryComponents: [SnackbarNotificationComponent]
})
export class SharedModule {}
