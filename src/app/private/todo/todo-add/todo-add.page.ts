import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { TodoService } from 'src/app/services/todo.service';

@Component({
  selector: 'app-todo-add',
  templateUrl: './todo-add.page.html',
  styleUrls: ['./todo-add.page.scss'],
})
export class TodoAddPage implements OnInit {
  categoryName: string;
  form: FormGroup;
  minDate = new Date().toISOString();

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
    this.route.params.subscribe((e) => {
      this.categoryName = e.categoryName as string;

      this.form = this.formBuilder.group({
        name: ['', Validators.required],
        date: [new Date().toISOString(), Validators.required],
        category: [this.categoryName],
      });
    });
  }

  hasError(control: string, error: string) {
    const c = this.form.controls[control];
    return c && (c.touched || c.dirty) && c.hasError(error);
  }

  markFormGroupTouched() {
    for (const i in this.form.controls) {
      if (this.form.controls.hasOwnProperty(i)) {
        const control = this.form.controls[i];
        control.markAsTouched();
      }
    }
  }

  submit() {
    if (!this.form.valid) {
      this.markFormGroupTouched();
      return;
    }
    this.todoService
      .create(this.form.value)
      .subscribe(() => this.navigateBack());
  }

  navigateBack() {
    this.router.navigate(['private', 'todo', this.categoryName]);
  }
}
