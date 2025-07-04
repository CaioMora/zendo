import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task } from '../models/task';
import { delay, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DasboardService {

  //readonly do endereço da API
  private readonly API = 'http://localhost:3000/tasks';

  constructor(private http: HttpClient) {}

  // method(GET)
  // Retorna todas as tarefas cadastradas no db.json
  getFirstTask() {
    return this.http.get<Task>(`${this.API}`).pipe(delay(2000));
  }
  // method(POST)
  // Cria uma nova tarefa no db.json
  createTask(task: any) {
    return this.http.post(`${this.API}`, task).pipe(take(1));
  }

  // method(GET)
  // Edita uma tarefa cadastrada no db.json passando o id na rota
  editTask(id: any) {
    return this.http.get(`${this.API}/${id}`).pipe(take(1));
  }

  // method(PUT)
  // Atualiza uma tarefa no db.json
  updateTask(task: any) {
    return this.http.put(`${this.API}/${task.id}`, task).pipe(take(1));
  }
  // method(DELTE)
  // Deleta uma tarefa existente no db.json
  deleteTask(id: any) {
    return this.http.delete(`${this.API}/${id}`).pipe(take(1));
  }
}
