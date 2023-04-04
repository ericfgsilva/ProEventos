import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidatorField } from '@app/helpers/ValidatorField';
import { User } from '@app/models/identity/User';
import { AccountService } from '@app/services/account.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  user = {} as User;
  formulario!: FormGroup;

  get form(): any {
    return this.formulario.controls;
  }

  constructor(private fb: FormBuilder,
              private accountService: AccountService,
              private router: Router,
              private spinner: NgxSpinnerService,
              private toaster: ToastrService) { }

  ngOnInit(): void {
    this.validation();
  }

  private validation(): void{

    const formOptions: AbstractControlOptions = {
      validators: ValidatorField.MustMatch('password', 'confirmePassword')
    };

    this.formulario = this.fb.group({
      primeiroNome: ['', [Validators.required, Validators.minLength(2)]],
      ultimoNome: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      userName: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmePassword: ['', Validators.required]
    }, formOptions);
  }

  public resetForm(): void {
    this.formulario.reset();
  }

  public cssValidator(campoForm: FormControl): any{
    return {'is-invalid': campoForm.errors && campoForm.touched};
  }

  register(): void{
    if(this.formulario.valid){
      this.spinner.show();
      this.user = { ...this.formulario.value };
      this.accountService.register(this.user).subscribe(
        () => {
          this.router.navigateByUrl('/user/login');
          this.toaster.success(`Usuário ${this.user.userName} registrado com sucesso`);
        },
        (error: any) => this.toaster.error(error.error)
      ).add(() => this.spinner.hide());
    }
  }

}
