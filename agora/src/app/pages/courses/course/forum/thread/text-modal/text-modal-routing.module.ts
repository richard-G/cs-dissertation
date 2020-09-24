import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TextModalPage } from './text-modal.page';

const routes: Routes = [
  {
    path: '',
    component: TextModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TextModalPageRoutingModule {}
