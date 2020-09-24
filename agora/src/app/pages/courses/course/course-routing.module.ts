import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CoursePage } from './course.page';

const routes: Routes = [
  {
    path: '',
    component: CoursePage
  },
  {
    path: 'forum',
    loadChildren: () => import('./forum/forum.module').then( m => m.ForumPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoursePageRoutingModule {}
