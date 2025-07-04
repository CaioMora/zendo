import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewTaskModalComponent, Status } from './new-task-modal.component';
import { DasboardService } from '../../services/dasboard.service';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('NewTaskModalComponent', () => {
  let component: NewTaskModalComponent;
  let fixture: ComponentFixture<NewTaskModalComponent>;
  let dashboardServiceSpy: jasmine.SpyObj<DasboardService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<NewTaskModalComponent>>;

  beforeEach(async () => {
    const dashboardSpy = jasmine.createSpyObj('DasboardService', ['createTask']);
    const dialogSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [NewTaskModalComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: DasboardService, useValue: dashboardSpy },
        { provide: MatDialogRef, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NewTaskModalComponent);
    component = fixture.componentInstance;
    dashboardServiceSpy = TestBed.inject(DasboardService) as jasmine.SpyObj<DasboardService>;
    dialogRefSpy = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<NewTaskModalComponent>>;

    fixture.detectChanges();
    component.ngOnInit(); // garante que o form seja inicializado
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty fields', () => {
    expect(component.form).toBeTruthy();
    expect(component.form.get('title')?.value).toBeNull();
    expect(component.form.get('owner')?.value).toBeNull();
    expect(component.form.get('status')?.value).toBeNull();
    expect(component.form.get('date')?.value).toBeNull();
  });

  it('should have allStatus predefined', () => {
    expect(component.allStatus.length).toBe(3);
    expect(component.allStatus).toContain(jasmine.objectContaining({ status: 'feito' }));
    expect(component.allStatus).toContain(jasmine.objectContaining({ status: 'parado' }));
    expect(component.allStatus).toContain(jasmine.objectContaining({ status: 'em progresso' }));
  });

  it('should submit form if valid and close dialog', () => {
    component.form.setValue({
      title: 'New Task',
      owner: 'Owner 1',
      status: 'feito',
      date: '2025-07-04'
    });

    dashboardServiceSpy.createTask.and.returnValue(of({}));

    component.onSubmit();

    expect(dashboardServiceSpy.createTask).toHaveBeenCalledWith(component.form.value);
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('should not submit form if invalid', () => {
    component.form.patchValue({
      owner: 'Owner 1'
      // title is required but missing
    });

    component.onSubmit();

    expect(dashboardServiceSpy.createTask).not.toHaveBeenCalled();
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });

  it('should handle createTask error', () => {
    spyOn(console, 'error');
    component.form.setValue({
      title: 'Error Task',
      owner: 'Owner X',
      status: 'parado',
      date: '2025-07-05'
    });

    dashboardServiceSpy.createTask.and.returnValue(throwError(() => new Error('HTTP Error')));

    component.onSubmit();

    expect(console.error).toHaveBeenCalled();
  });

  it('should cancel and close dialog', () => {
    component.form.patchValue({
      title: 'Task To Cancel',
      owner: 'Owner',
      status: 'feito',
      date: '2025-07-06'
    });

    component.onCancel();

    expect(dialogRefSpy.close).toHaveBeenCalled();
  });
});
