import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { NavComponent } from '../nav/nav.component';

@NgModule({
  imports: [CommonModule, SharedModule],
  exports: [NavComponent],
  declarations: [NavComponent]
})
export class CoreModule {}
