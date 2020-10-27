import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { TodoService } from 'src/app/services/todo.service';

@Component({
  selector: 'app-todo-edit',
  templateUrl: './todo-edit.page.html',
  styleUrls: ['./todo-edit.page.scss'],
})
export class TodoEditPage implements OnInit {
  categoryName: string;
  form: FormGroup;
  minDate = new Date().toISOString();
  todoId: string;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private todoService: TodoService,
    private router: Router
  ) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.minDate = today.toISOString();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      date: [new Date().toISOString(), Validators.required],
      category: [''],
      done: [false],
    });

    this.route.params.subscribe((e) => {
      this.categoryName = e.categoryName as string;
      this.todoId = e.todoId as string;

      this.todoService.getById(this.todoId).subscribe((todo) => {
        console.log(todo);
        this.form.patchValue({ ...todo });
      });
    });
  }

  hasError(control: string, error: string) {
    const c = this.form.controls[control];
    return c && (c.touched || c.dirty) && c.hasError(error);
  }

  navigateBack() {
    this.router.navigate(['private', 'todo', this.categoryName]);
  }

  submit() {
    if (!this.form.valid) {
      return;
    }

    this.todoService
      .update(this.todoId, this.form.value)
      .subscribe(() => this.navigateBack());
  }
}
