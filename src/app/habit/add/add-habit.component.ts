import { Component } from '@angular/core';
import { NgForm, FormControl, Validators } from '@angular/forms';

import { HabitService } from '../habit.service';
import { Recurrence } from './reccurence.model';
import { Habit } from '../models/habit.model';
import { MatSnackBar } from '@angular/material';
import { SnackbarNotificationComponent } from 'src/app/shared/snackbar-notification/snackbar-notification.component';

@Component({
  templateUrl: './add-habit.component.html',
  styleUrls: ['./add-habit.component.scss'],
})
export class AddHabitComponent {
  isLoading = false;

  specifying = false;

  newHabit: Habit;

  reccurenceControl = new FormControl('', [Validators.required]);

  reccurencesPossibilities: Recurrence[] = [];

  constructor(
    private habitService: HabitService,
    private snackBar: MatSnackBar
  ) {
    for (let daynumber = 0; daynumber < 7; daynumber++) {
      this.reccurencesPossibilities.push({
        day: this.habitService.getDay(daynumber) + 's',
        daynumber: daynumber,
      });
    }

    // On initialise notre nouvelle habitude
    this.newHabit = {
      _id: undefined,
      action: undefined,
      creationDate: new Date(),
      recurrence: [],
      recurrenceText: undefined,
      achievedDates: undefined,
    };
    this.newHabit.creationDate.setHours(0, 0, 0, 0);
  }

  /**
   * Change la récurrence de l'habitude.
   */
  changeReccurence(daynumber: number) {
    this.newHabit.recurrence = [];
    if (daynumber === 8) {
      this.specifying = true;
    } else if (daynumber < 8) {
      this.specifying = false;
      if (daynumber === 7) {
        this.newHabit.recurrence = [0, 1, 2, 3, 4, 5, 6];
      } else {
        this.newHabit.recurrence = [daynumber];
      }
    }
  }

  /**
   * Ajoute / retire le jour passé en paramètre de la récurrence de la nouvelle habitude.
   */
  toggleDay(daynumber: number) {
    const index = this.newHabit.recurrence.indexOf(daynumber);
    if (index === -1) {
      this.newHabit.recurrence.push(daynumber);
    } else {
      this.newHabit.recurrence.splice(index, 1);
    }
  }

  /**
   * Crée la nouvelle habitude en l'envoyant à l'API.
   */
  saveHabit(form: NgForm) {
    if (form.valid) {
      if (this.newHabit.recurrence.length === 0) {
        this.snackBar.openFromComponent(SnackbarNotificationComponent, {
          duration: 4000,
          data: {
            message: 'Please select a recurrence before saving.',
            image: 'assets/icons/warning.svg',
          },
        });
      } else {
        this.newHabit.action = form.value.action;
        this.isLoading = true;
        this.habitService.addHabit(this.newHabit);
      }
    }
  }
}
