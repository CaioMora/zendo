import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { DasboardService } from '../../services/dasboard.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { of, throwError } from 'rxjs';
import { Task } from '../../models/task';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let dashboardServiceSpy: jasmine.SpyObj<DasboardService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let routerSpy: jasmine.SpyObj<Router>;
  let modalServiceSpy: jasmine.SpyObj<BsModalService>;
  let modalRefSpy: jasmine.SpyObj<BsModalRef>;

  beforeEach(async () => {
    dashboardServiceSpy = jasmine.createSpyObj('DasboardService', ['getFirstTask', 'deleteTask']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    modalServiceSpy = jasmine.createSpyObj('BsModalService', ['show']);
    modalRefSpy = jasmine.createSpyObj('BsModalRef', ['hide']);

    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      providers: [
        { provide: DasboardService, useValue: dashboardServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: {} },
        { provide: BsModalService, useValue: modalServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    component.deleteModalRef = modalRefSpy;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getTasksData and set taskInfo', () => {
    const mockTask: Task = {
      id: 1,
      title: 'Test Task',
      owner: 'Tester',
      status: 'feito',
      date: '2025-07-04'
    };

    dashboardServiceSpy.getFirstTask.and.returnValue(of(mockTask));

    component.getTasksData();

    expect(dashboardServiceSpy.getFirstTask).toHaveBeenCalled();
    expect(component.taskInfo).toEqual(mockTask);
  });

  it('should handle getTasksData error', () => {
    spyOn(console, 'log');
    dashboardServiceSpy.getFirstTask.and.returnValue(throwError(() => new Error('HTTP Error')));

    component.getTasksData();

    expect(console.log).toHaveBeenCalled();
  });

  it('should open new task dialog and refresh tasks after close', () => {
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of('closed') });
    dialogSpy.open.and.returnValue(dialogRefSpyObj);

    spyOn(component, 'getTasksData');

    component.newTask();

    expect(dialogSpy.open).toHaveBeenCalled();
    expect(component.getTasksData).toHaveBeenCalled();
  });

  it('should navigate to edit task', () => {
    const mockId = 1;
    const mockRoute = {} as ActivatedRoute;
    component['route'] = mockRoute;

    component.editTask(mockId);

    expect(routerSpy.navigate).toHaveBeenCalledWith(['editar', mockId], { relativeTo: mockRoute });
  });

  it('should show delete modal', () => {
    const mockTask: Task = {
      id: 2,
      title: 'Task to Delete',
      owner: 'Owner',
      status: 'parado',
      date: '2025-07-05'
    };

    component.deleteModal = 'mockTemplate';
    modalServiceSpy.show.and.returnValue(modalRefSpy);

    component.deleteTask(mockTask);

    expect(component.taskDelete).toEqual(mockTask);
    expect(modalServiceSpy.show).toHaveBeenCalledWith('mockTemplate', { class: 'modal-sm' });
  });

  it('should confirm delete and refresh tasks', () => {
    spyOn(console, 'log');
    spyOn(component, 'getTasksData');

    const mockTask: Task = {
      id: 3,
      title: 'Task to Confirm Delete',
      owner: 'Owner',
      status: 'em progresso',
      date: '2025-07-06'
    };

    component.taskDelete = mockTask;
    dashboardServiceSpy.deleteTask.and.returnValue(of({}));

    component.onConfirm();

    expect(dashboardServiceSpy.deleteTask).toHaveBeenCalledWith(mockTask.id);
    expect(component.getTasksData).toHaveBeenCalled();
    expect(modalRefSpy.hide).toHaveBeenCalled();
  });

  it('should handle delete error', () => {
    spyOn(console, 'log');

    component.taskDelete = { id: 4, title: '', owner: '', status: '', date: '' };
    dashboardServiceSpy.deleteTask.and.returnValue(throwError(() => new Error('Delete Error')));

    component.onConfirm();

    expect(console.log).toHaveBeenCalled();
  });

  it('should cancel delete', () => {
    component.onCancel();

    expect(modalRefSpy.hide).toHaveBeenCalled();
  });
});
