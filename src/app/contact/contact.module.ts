import { NgModule } from '@angular/core';

import { ContactComponent } from './contact.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [SharedModule],
  declarations: [ContactComponent],
})
export class ContactModule { }
