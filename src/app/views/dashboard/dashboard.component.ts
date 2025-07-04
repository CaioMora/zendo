import { Component, ViewChild } from '@angular/core';
import { NewTaskModalComponent } from '../../components/new-task-modal/new-task-modal.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from '../../models/task';
import { DasboardService } from '../../services/dasboard.service';
import { MatDialog } from '@angular/material/dialog';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  taskInfo!: any;
  deleteModalRef!: BsModalRef;
  taskDelete!: Task;
  @ViewChild('deleteModal') deleteModal: any;

  constructor(
    private dashboardService: DasboardService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.getTasksData();
  }

  //retorna o data da requisição
  getTasksData() {
    this.dashboardService.getFirstTask().subscribe(
      (data: any) => {
        this.taskInfo = data;
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }

  //abre a modal para a criação de uma nova tarefa
  newTask(): void {
    const dialogRef = this.dialog.open(NewTaskModalComponent, {
      width: '400px',
      height: '370px',
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result)
      this.getTasksData();
    });
  }

  //navega para a página de editar uma tarefa
  editTask(id: any) {
    this.router.navigate(['editar', id], { relativeTo: this.route });
  }

  //deleta uma tarefa registrada no banco
  deleteTask(task: any) {
    this.taskDelete = task;
    this.deleteModalRef = this.modalService.show(this.deleteModal, {
      class: 'modal-sm',
    });
  }

  //confirmação para deletar a tarefa
  onConfirm() {
    this.dashboardService.deleteTask(this.taskDelete.id).subscribe(
      (success: any) => {
        console.log(success)
        this.getTasksData(), this.deleteModalRef.hide();
      },
      (error: any) => console.log(error)
    );
  }

  //cancela a confirmação de deletar tarefa
  onCancel() {
    this.deleteModalRef.hide();
  }
}
