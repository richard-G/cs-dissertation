import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateThreadPageRoutingModule } from './create-thread-routing.module';

import { CreateThreadPage } from './create-thread.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ComponentsModule,
    CreateThreadPageRoutingModule
  ],
  declarations: [CreateThreadPage]
})
export class CreateThreadPageModule {}
