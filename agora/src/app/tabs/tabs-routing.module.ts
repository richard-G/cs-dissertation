import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/users/courses',
    pathMatch: 'full'
  },
  {
    path: '',
    component: TabsPage,
    children: [
      // {
      //   path: '',
      //   loadChildren: () => import('../pages/courses/courses.module').then(m => m.CoursesPageModule)
      // },
      {
        path: 'courses',
        loadChildren: () => import('../pages/courses/courses.module').then(m => m.CoursesPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../pages/profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('../pages/settings/settings.module').then(m => m.SettingsPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
