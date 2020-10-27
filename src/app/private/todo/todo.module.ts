import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TodoPageRoutingModule } from './todo-routing.module';

import { TodoPage } from './todo.page';
import { TodoAddPage } from './todo-add/todo-add.page';
import { TodoEditPage } from './todo-edit/todo-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TodoPageRoutingModule
  ],
  declarations: [TodoPage, TodoAddPage, TodoEditPage]
})
export class TodoPageModule {}
