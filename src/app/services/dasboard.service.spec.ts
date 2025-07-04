import { TestBed } from '@angular/core/testing';
import { DasboardService } from './dasboard.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Task } from '../models/task';

describe('DasboardService', () => {
  let service: DasboardService;
  let httpMock: HttpTestingController;
  const API = 'http://localhost:3000/tasks';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DasboardService]
    });

    service = TestBed.inject(DasboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should GET first task', () => {
    const dummyTask: Task = {
      id: 1,
      title: 'Task 1',
      owner: 'Owner 1',
      status: 'Pending',
      date: '2025-07-04'
    };

    service.getFirstTask().subscribe(task => {
      expect(task).toEqual(dummyTask);
    });

    const req = httpMock.expectOne(API);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTask);
  });

  it('should POST a new task', () => {
    const newTask: Task = {
      id: 2,
      title: 'New Task',
      owner: 'New Owner',
      status: 'In Progress',
      date: '2025-07-05'
    };

    service.createTask(newTask).subscribe(response => {
      expect(response).toEqual(newTask);
    });

    const req = httpMock.expectOne(API);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTask);
    req.flush(newTask);
  });

  it('should GET a task by ID for editing', () => {
    const dummyTask: Task = {
      id: 1,
      title: 'Edit Task',
      owner: 'Owner Edit',
      status: 'Done',
      date: '2025-07-06'
    };

    service.editTask(1).subscribe(task => {
      expect(task).toEqual(dummyTask);
    });

    const req = httpMock.expectOne(`${API}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTask);
  });

  it('should PUT (update) a task', () => {
    const updatedTask: Task = {
      id: 1,
      title: 'Updated Task',
      owner: 'Updated Owner',
      status: 'Done',
      date: '2025-07-07'
    };

    service.updateTask(updatedTask).subscribe(response => {
      expect(response).toEqual(updatedTask);
    });

    const req = httpMock.expectOne(`${API}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedTask);
    req.flush(updatedTask);
  });

  it('should DELETE a task', () => {
    service.deleteTask(1).subscribe(response => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(`${API}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
