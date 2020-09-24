import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CoursesPage } from './courses.page';

const routes: Routes = [
  {
    path: '',
    component: CoursesPage
  },
  {
    path: 'course',
    loadChildren: () => import('./course/course.module').then( m => m.CoursePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoursesPageRoutingModule {}
