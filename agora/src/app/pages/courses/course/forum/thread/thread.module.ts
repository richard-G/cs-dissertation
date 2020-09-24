import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ThreadPageRoutingModule } from './thread-routing.module';

import { ThreadPage } from './thread.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { TextModalPageModule } from './text-modal/text-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ThreadPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ThreadPage]
})
export class ThreadPageModule {}
