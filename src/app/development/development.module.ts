import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { DevelopmentComponent } from './development.component';

@NgModule({
  imports: [SharedModule],
  exports: [DevelopmentComponent],
  declarations: [DevelopmentComponent],
  providers: []
})
export class DevelopmentModule {}
