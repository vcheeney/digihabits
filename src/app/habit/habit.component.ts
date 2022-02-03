import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';

// Importation des services
import { HabitService } from './habit.service';

// Importation des modèles
import { Subscription } from 'rxjs';
import { Habit } from './models/habit.model';
import { FormattedDate } from './models/formatteddates.model';
import { ConfirmationComponent } from '../shared/confirmation/confirmation.component';

@Component({
  templateUrl: './habit.component.html',
  styleUrls: ['./habit.component.scss']
})
export class HabitComponent implements OnInit, OnDestroy {
  pastDays: FormattedDate[] = [];
  shownPastDates: FormattedDate[] = [];
  today: Date;

  habits: Habit[];
  private habitsSub: Subscription;

  constructor(private habitService: HabitService, public dialog: MatDialog) {}

  ngOnInit() {
    // Appelle la lecture du HabitsData et s'abonne aux updates du HabitsData.
    this.habitService.getHabits();
    this.habitsSub = this.habitService.getHabitsUpdated().subscribe(habits => {
      this.habits = habits;
    });

    // Crée le tableau de dates qui sera utilisé pour afficher les entrées
    for (let i = 0; i < 10; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      this.pastDays.push({
        fulldate: date,
        day: this.habitService
          .getDay(date.getDay())
          .substring(0, 3)
          .toUpperCase(),
        daynumber: date.getDay(),
        date: date.getDate()
      });
    }

    // On initie la variable "today" qui contient le jour d'aujourd'hui sans le temps.
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);

    // On détermine les entrées à afficher en fonction de la grandeur de l'écran.
    this.updateShownEntries();

    /**
     * Détection du changement de la grandeur de l'écran.
     * On utilie un setTiemout ici pour vérifier que 500 ms se sont écouler avant d'updater
     * notre nombre d'entrées affichées. Autrement, ça rend l'application un peu plus lente.
     */
    let resize: any;
    window.onresize = () => {
      clearTimeout(resize);
      resize = setTimeout(() => {
        this.updateShownEntries();
      }, 500);
    };
  }

  /**
   * Ajuste le nombre d'entrée affichée en fonction de la largeur de l'écran.
   */
  updateShownEntries() {
    let amountOfShownEntries;

    if (screen.width >= 768) {
      amountOfShownEntries = screen.width / 150;
    } else {
      amountOfShownEntries = screen.width / 110;
    }

    if (amountOfShownEntries > 9) {
      amountOfShownEntries = 9;
    }

    this.shownPastDates = this.pastDays.slice(0, amountOfShownEntries);
  }

  /**
   * Vérifie si la case passée en paramètre de l'habitude passée en paramètre est cochée.
   */
  isChecked(habit: Habit, date: Date) {
    let checked = false;
    habit.achievedDates.forEach(achievedDate => {
      const datee = new Date(achievedDate);
      if (datee.getTime() === date.getTime()) {
        checked = true;
      }
    });

    return checked;
  }

  /**
   * Compare la date de la case qui s'affiche avec celle de l'entrée.
   * (Appelée depuis la fonction précédente)
   *
   */
  datesAreEqual(entryDate: Date, showedDate: Date) {
    if (
      entryDate.getDate() === showedDate.getDate() &&
      entryDate.getMonth() === showedDate.getMonth() &&
      entryDate.getFullYear() === showedDate.getFullYear()
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Coche / décoche une habitude pour une journée.
   */
  updateEntry(habit_id: string, date: Date, checked: boolean) {
    this.habitService.toggleAchievedDate(habit_id, date, checked);
  }

  /**
   * Supprime l'habitude
   */
  deleteHabit(habit: Habit) {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '500px',
      data: { habit: habit }
    });

    dialogRef.afterClosed().subscribe(deleteConfirmed => {
      if (deleteConfirmed) {
        this.habitService.deleteHabit(habit._id);
      }
    });
  }

  /**
   * (Appelée à la destruction du component)
   */
  ngOnDestroy() {
    this.habitsSub.unsubscribe();
  }
}
