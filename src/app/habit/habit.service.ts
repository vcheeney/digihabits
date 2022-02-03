import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

// Importation des services
import { AuthService } from '../auth/auth.service';

// Importation des modèles
import { Habit } from './models/habit.model';

// Imporation des variables d'environnement
import { environment } from '../../environments/environment';
const BACKEND_URL = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class HabitService {
  private habitsUpdated = new Subject<Habit[]>();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Va chercher toutes les habitudes de l'utilisateur.
   * On crée en même le texte des jours de récurrence qui sera affiché dans la liste des habitudes.
   */
  getHabits() {
    const userId: string = this.authService.getUserId();
    this.http
      .get<{ habits: Habit[] }>(
        BACKEND_URL + '/habits/get/habits/byUserId/' + userId
      )
      .pipe(
        map(data => {
          return {
            habits: data.habits.map(habit => {
              return {
                _id: habit._id,
                action: habit.action,
                creationDate: new Date(habit.creationDate),
                recurrence: habit.recurrence,
                recurrenceText: this.getRecurrenceText(
                  habit.recurrence.sort((a, b) => a - b)
                ),
                achievedDates: habit.achievedDates,
              };
            }),
          };
        })
      )
      .subscribe(data => {
        this.habitsUpdated.next(data.habits);
      });
  }

  /**
   * Permet aux component de s'abonner au update des habitudes.
   */
  getHabitsUpdated() {
    return this.habitsUpdated.asObservable();
  }

  /**
   * Ajoute l'habitude passée en paramètre aux habitudes de l'utilisateur connecté.
   */
  addHabit(habit: Habit) {
    this.http
      .post(BACKEND_URL + '/habits/add/', habit)
      .subscribe(savedHabit => {
        this.router.navigate(['/habits']);
      });
  }

  /**
   * Supprime l'habitude dont l'id est passé en paramètre.
   */
  deleteHabit(habit_id: string) {
    const body = {
      habit_id: habit_id,
    };
    this.http.post(BACKEND_URL + '/habits/delete', body).subscribe(response => {
      this.getHabits();
    });
  }

  /**
   * Ajoute la date passée en paramètre au tableau d'"achievedDates" de l'habitude dont l'ID est passé en paramètre.
   */
  toggleAchievedDate(habit_id: string, date: Date, checked: Boolean) {
    // On se crée un body où on insert nos données nécessaires à notre requête.
    const body: any = {
      habit_id: habit_id,
      date: date,
      checked: checked,
    };

    this.http
      .post(BACKEND_URL + '/habits/toggleDate/', body)
      .subscribe(response => {});
  }

  /**
   * Retourne un string indiquant les jours où l'habitude doit se répéter.
   */
  getRecurrenceText(dayNumbers: number[]) {
    let recurrenceText: string;
    if (dayNumbers.length === 7) {
      recurrenceText = 'days';
    } else {
      recurrenceText = '';
      dayNumbers.forEach((dayNumber, index) => {
        recurrenceText += this.getDay(dayNumber) + 's'; // J'ajoute un "s" car le jour retourné doit être au pluriel. Ex: À tous les "dimanches", "lundis", etc.
        // Si je ne suis pas à mon dernier item, j'ajoute une ',' avant d'afficher le prochain jour.
        if (index < dayNumbers.length - 2) {
          recurrenceText += ', ';
        } else {
          if (index === dayNumbers.length - 2) {
            recurrenceText += ' and ';
          }
        }
      });
    }

    return recurrenceText;
  }

  /**
   * Retourne le jour associé à la date passée en paramètre.
   */
  getDay(dayNumber: number) {
    let day: string;
    switch (dayNumber) {
      case 0:
        day = 'Sunday';
        break;
      case 1:
        day = 'Monday';
        break;
      case 2:
        day = 'Tuesday';
        break;
      case 3:
        day = 'Wednesday';
        break;
      case 4:
        day = 'Thursday';
        break;
      case 5:
        day = 'Friday';
        break;
      case 6:
        day = 'Saturday';
        break;
      default:
        day = 'What?';
        break;
    }

    return day;
  }
}
