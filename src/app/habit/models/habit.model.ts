export interface Habit {
  _id: string;
  action: string;
  creationDate: Date;
  recurrence: number[]; // Un tableau des jours de la semaine où l'habitude doit se répéter.
  recurrenceText: string;
  achievedDates: Date[];
}
