import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForumPage } from './forum.page';

const routes: Routes = [
  {
    path: '',
    component: ForumPage
  },
  {
    path: 'thread/:id',
    loadChildren: () => import('./thread/thread.module').then( m => m.ThreadPageModule)
  },
  {
    path: 'create-thread',
    loadChildren: () => import('./create-thread/create-thread.module').then( m => m.CreateThreadPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForumPageRoutingModule {}
