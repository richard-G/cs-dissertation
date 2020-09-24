import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TextModalPageRoutingModule } from './text-modal-routing.module';

import { TextModalPage } from './text-modal.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ComponentsModule,
    TextModalPageRoutingModule
  ],
  declarations: [TextModalPage]
})
export class TextModalPageModule {}
