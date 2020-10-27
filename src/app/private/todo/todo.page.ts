import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TodoService } from 'src/app/services/todo.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Todo } from 'src/app/dto/todo.dto';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.page.html',
  styleUrls: ['./todo.page.scss'],
})
export class TodoPage implements OnInit {
  todosByDay = {};
  categoryName: string;
  categoryIcon = 'person';
  today = new Date().toISOString().split('T')[0];
  todayTasksDoneCount = 0;
  todayTasksCount = 0;
  todosByDayKeys: string[];
  colors = ['#f77b67', '#5a89e6', '#4ec5ac'];
  categories = ['personal', 'home', 'work'];
  color: string;

  constructor(
    private route: ActivatedRoute,
    private todoService: TodoService,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.route.params.subscribe((e) => {
      this.categoryName = e.categoryName as string;
      this.color = this.colors[this.categories.indexOf(this.categoryName)];
      this.loadTodos();
    });
  }

  loadTodos() {
    this.todoService.getAllByCategory(this.categoryName).subscribe((todos) => {
      this.todosByDay = _.groupBy(todos, (todo) => {
        return moment(todo.date).startOf('day').format();
      });

      this.todosByDayKeys = Object.keys(this.todosByDay);

      for (const day of Object.keys(this.todosByDay)) {
        if (this.isToday(new Date(day))) {
          this.todayTasksCount = this.todosByDay[day].length;
          this.todayTasksDoneCount = this.todosByDay[day].filter(
            (todo) => todo.done
          ).length;
        }
      }
    });
  }

  private isToday(date: Date) {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  private isTomorrow(date: Date) {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    return (
      date.getDate() === tomorrow.getDate() &&
      date.getMonth() === tomorrow.getMonth() &&
      date.getFullYear() === tomorrow.getFullYear()
    );
  }

  getDate(d: string) {
    const date = new Date(d);
    if (this.isToday(date)) {
      return 'Today';
    }
    if (this.isTomorrow(date)) {
      return 'Tomorrow';
    }
    return date.toLocaleDateString();
  }

  markDone(todo: Todo) {
    if (todo.done) {
      return;
    }
    this.todoService.markDone(todo._id).subscribe(() => this.loadTodos());
  }

  gotoCreatePage() {
    this.router.navigate(['private', 'todo', this.categoryName, 'todo-add']);
  }

  update(todo: Todo) {
    this.router.navigate([
      'private',
      'todo',
      this.categoryName,
      'todo-edit',
      todo._id,
    ]);
  }

  getPercentageCategory() {
    const pct = (100 * this.todayTasksDoneCount) / this.todayTasksCount / 100;
    return pct;
  }

  async delete(todo: Todo) {
    const alert = await this.alertController.create({
      header: 'Task deletion',
      message: `Do you confirm the deletion of task ${todo.name}`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'Okay',
          cssClass: 'danger',
          handler: () => {
            this.todoService
              .delete(todo._id)
              .subscribe((e) => this.loadTodos());
          },
        },
      ],
    });

    await alert.present();
  }
}
