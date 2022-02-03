import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { AuthorComponent } from './author.component';

@NgModule({
  imports: [SharedModule],
  exports: [AuthorComponent],
  declarations: [AuthorComponent]
})
export class AuthorModule {}
