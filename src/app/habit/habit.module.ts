// Importation des modules Angular
import { NgModule } from '@angular/core';

// Importation des components
import { AddHabitComponent } from './add/add-habit.component';
import { HabitComponent } from './habit.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    HabitComponent,
    AddHabitComponent
  ],
  imports: [
    SharedModule
  ]
})
export class HabitModule {}
