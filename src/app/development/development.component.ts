import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-development',
  templateUrl: 'development.component.html',
  styleUrls: ['development.component.scss']
})

export class DevelopmentComponent {
  show = true;

  close() {
    this.show = false;
  }
}
