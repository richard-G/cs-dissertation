import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateThreadPage } from './create-thread.page';

const routes: Routes = [
  {
    path: '',
    component: CreateThreadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateThreadPageRoutingModule {}
