import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ThreadPage } from './thread.page';

const routes: Routes = [
  {
    path: '',
    component: ThreadPage
  },
  {
    path: 'text-modal',
    loadChildren: () => import('./text-modal/text-modal.module').then( m => m.TextModalPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThreadPageRoutingModule {}
