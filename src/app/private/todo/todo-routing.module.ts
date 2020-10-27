import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TodoAddPage } from './todo-add/todo-add.page';
import { TodoEditPage } from './todo-edit/todo-edit.page';

import { TodoPage } from './todo.page';

const routes: Routes = [
  {
    path: ':categoryName',
    component: TodoPage,
  },
  {
    path: ':categoryName/todo-add',
    component: TodoAddPage,
  },
  {
    path: ':categoryName/todo-edit/:todoId',
    component: TodoEditPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TodoPageRoutingModule {}
