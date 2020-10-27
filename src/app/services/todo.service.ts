import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import CreateTodoDTO from '../dto/todo-create.dto';
import { TodoSummary } from '../dto/todo-summary.dto';
import { Todo } from '../dto/todo.dto';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Todo[]>(`${environment.backendUrl}/todo`);
  }

  getById(todoId: string) {
    return this.http.get<Todo>(`${environment.backendUrl}/todo/${todoId}`);
  }

  getAllByCategory(category: string) {
    return this.http.get<Todo[]>(
      `${environment.backendUrl}/todo?category=${category}`
    );
  }

  create(todo: CreateTodoDTO) {
    return this.http.post(`${environment.backendUrl}/todo`, todo);
  }

  update(todoId: string, todo: any) {
    return this.http.put(`${environment.backendUrl}/todo/${todoId}`, todo);
  }

  markDone(todoId: string) {
    return this.http.put(`${environment.backendUrl}/todo/${todoId}/done`, {});
  }

  delete(todoId: string) {
    return this.http.delete(`${environment.backendUrl}/todo/${todoId}`);
  }

  getTodoSummary() {
    return this.http.get<TodoSummary[]>(
      `${environment.backendUrl}/todo/me/summary`
    );
  }
}
