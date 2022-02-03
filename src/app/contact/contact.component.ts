import { Component } from '@angular/core';

import { ContactService } from './contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: 'contact.component.html',
  styleUrls: ['contact.component.scss'],
})
export class ContactComponent {
  messageSent = false;

  messageTypes = ['Comment', 'Information needed', 'Bug report', 'Other'];

  message = {
    firstname: undefined,
    lastname: undefined,
    email: undefined,
    messageType: undefined,
    message: undefined,
  };

  constructor(private contactService: ContactService) {}

  sendMessage() {
    this.messageSent = true;
    this.contactService.sendMessage(this.message);
  }
}
