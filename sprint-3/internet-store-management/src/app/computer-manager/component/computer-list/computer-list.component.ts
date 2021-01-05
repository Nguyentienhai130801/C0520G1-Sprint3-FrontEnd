import {Component, OnInit} from '@angular/core';
import {Computer} from '../../model/Computer.class';
import {ComputerService} from '../../service/computer.service';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {MatDialog} from '@angular/material/dialog';
import {ComputerDeleteComponent} from '../computer-delete/computer-delete.component';
import {ComputerStatus} from '../../model/ComputerStatus.class';


@Component({
  selector: 'app-computer-list',
  templateUrl: './computer-list.component.html',
  styleUrls: ['./computer-list.component.css']
})
export class ComputerListComponent implements OnInit {
  public computers: Computer[];
  // tslint:disable-next-line:new-parens
  public computer = new Computer;
  public computerStatuses: ComputerStatus[];
  p: number;
  form: FormGroup;
  handleCommentForm: FormGroup;
  checkButton = false;
  typeComputer = '';
    public formSearch: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private computerService: ComputerService,
    private toastr: ToastrService,
  ) {
  }

  ngOnInit(): void {
    this.checkButton = false;
    this.p = 0;
    this.computerService.getAllComputerStatus().subscribe(data => {
      this.computerStatuses = data;
    });
    this.computerService.getAllComputer().subscribe(data => {
      this.computers = data;
      console.log(this.computers);
    }, error => {
    }, () => {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.computers.length; i++) {
        this.computers[i].statusView = false;
      }
    });
    this.handleCommentForm = this.formBuilder.group({
      idComputer: [''],
      computerName: ['', [Validators.required, Validators.maxLength(30), Validators.pattern(/^[a-zA-Zà-ỹÀ-Ỹ_0-9\s]{3,30}$/)]],
      fullName: [''],
      idStatusComputer: ['', Validators.required],
      timeStart: [''],
      timeUser: [''],
      status: [''],
      money: [''],
    });
    this.formSearch = this.formBuilder.group({
      idStatusComputer: [''],
    });
  }

  dialogDeleteComment(idComputer): void {
    this.computerService.getComputerById(idComputer).subscribe(dataName => {
      const dialogRef = this.dialog.open(ComputerDeleteComponent, {
        width: '500px',
        data: {fullName: dataName},
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(result => {
        this.ngOnInit();
      });
    }, error => console.log(error));
  }

  changeSelection(idComputer): void {
    if (idComputer == null) {
      console.log('a');
      // @ts-ignore
      this.computers.shift(this.computer);
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.computers.length; i++) {
        // tslint:disable-next-line:triple-equals
        if (idComputer == this.computers[i].idComputer) {
          this.computers[i].statusView = !this.computers[i].statusView;
        }
      }
      this.checkButton = false;
    } else {
      // tslint:disable-next-line:triple-equals
      if (this.checkButton == false) {
        this.computerService.getComputerById(idComputer).subscribe(dataName => {
          console.log(dataName);
          this.typeComputer = dataName.idStatusComputer;
          console.log(this.typeComputer);
          this.handleCommentForm.controls.idStatusComputer.setValue(this.typeComputer);
          this.handleCommentForm.patchValue(dataName);
          console.log('dataName');
          console.log(dataName);
        });
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.computers.length; i++) {
          // tslint:disable-next-line:triple-equals
          if (idComputer == this.computers[i].idComputer) {
            this.computers[i].statusView = !this.computers[i].statusView;
          }
        }
        this.checkButton = true;
      }
      console.log(this.computers);
    }
  }

  editComputer(idComputer): void {
    this.handleCommentForm.markAllAsTouched();
    if (this.handleCommentForm.valid) {
      if (idComputer == null) {
        this.computerService.addNewComputer(this.handleCommentForm.value).subscribe(data => {
          this.ngOnInit();
          this.toastr.success('Thêm máy thành công!', 'Thành công!');
          this.changeSelection(idComputer);
          this.checkButton = false;
        });
      } else {
        this.computerService.editComputer(idComputer, this.handleCommentForm.value).subscribe(data => {
          this.toastr.success('Sửa máy thành công!', 'Thành công!');
          idComputer = null;
          this.ngOnInit();
          this.changeSelection(idComputer);
        });
      }
    }
  }

  addForm(): void {
    // tslint:disable-next-line:triple-equals
    if (this.checkButton == false) {
      console.log(this.computers.length);
      this.checkButton = true;
      this.computer = new Computer();
      this.computer.idComputer = null;
      this.computer.statusView = true;
      this.computers.unshift(this.computer);
      console.log(this.computers.length);
    }
  }

  changeSelection123(idComputer): void {
    if (idComputer == null) {
      // @ts-ignore
      this.computers.shift(this.computer);
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.computers.length; i++) {
        // tslint:disable-next-line:triple-equals
        if (idComputer == this.computers[i].idComputer) {
          this.computers[i].statusView = !this.computers[i].statusView;
        }
      }
      this.checkButton = false;
    } else {
      // tslint:disable-next-line:triple-equals
      if (this.checkButton == true) {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.computers.length; i++) {
          // tslint:disable-next-line:triple-equals
          if (idComputer == this.computers[i].idComputer) {
            this.computers[i].statusView = !this.computers[i].statusView;
          }
        }
        this.ngOnInit();
      }
    }
  }
  onSearch(): void {
    this.p = 0;
    // tslint:disable-next-line:max-line-length
    this.computerService.search(this.handleCommentForm.value.idStatusComputer).subscribe(data => {
      this.computers = data;
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.computers.length; i++) {
        this.computers[i].statusView = false;
      }
    }, error =>  console.log(error));
  }
}
