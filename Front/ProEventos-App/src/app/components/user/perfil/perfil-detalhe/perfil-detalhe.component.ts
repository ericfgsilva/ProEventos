import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatorField } from '@app/helpers/ValidatorField';
import { UserUpdate } from '@app/models/identity/UserUpdate';
import { AccountService } from '@app/services/account.service';
import { PalestranteService } from '@app/services/palestrante.service';
import { Funcao } from '@app/shared/enums/funcao';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-perfil-detalhe',
  templateUrl: './perfil-detalhe.component.html',
  styleUrls: ['./perfil-detalhe.component.scss']
})
export class PerfilDetalheComponent implements OnInit {

  @Output() changeFormValue = new EventEmitter();

  userUpdate = {} as UserUpdate;
  form!: FormGroup;

  constructor(private fb: FormBuilder,
    private accountService: AccountService,
    private palestranteService: PalestranteService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService) { }

  ngOnInit() {
    this.validation();
    this.carregarUsuario();
    this.verificaForm();
  }

  private verificaForm(): void {
    this.form.valueChanges
      .subscribe(() => this.changeFormValue.emit({...this.form.value}))
  }

  private carregarUsuario(): void{
    this.spinner.show();
    this.accountService.getUser().subscribe(
      (userRetorno: UserUpdate) => {
        this.userUpdate = userRetorno;
        this.form.patchValue(this.userUpdate);
        this.toaster.success('Usuário Carregado', 'Sucesso');
      },
      (error) => {
        console.error(error);
        this.toaster.error('Usuário não Carregado', 'Erro');
        this.router.navigate(['/dashboard']);
      }
    )
    .add(() => this.spinner.hide());
  }

  private validation(): void{

    const formOptions: AbstractControlOptions = {
      validators: ValidatorField.MustMatch('password', 'confirmePassword')
    };

    this.form = this.fb.group({
      userName: [''],
      imagemURL: [''],
      titulo: ['NaoInformado', Validators.required],
      primeiroNome: ['', [Validators.required, Validators.minLength(2)]],
      ultimoNome: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.minLength(10)]],
      funcao: ['NaoInformado', Validators.required],
      descricao: ['', Validators.required],
      password: ['', [Validators.minLength(6), Validators.nullValidator]],
      confirmePassword: ['', Validators.nullValidator],
    }, formOptions);
  }
  get f(): any {
    return this.form.controls;
  }

  onSubmit(): void {
    this.atualizarUsuario()
  }

  public atualizarUsuario(): void {
    if(this.form.valid){
      this.userUpdate = { ...this.form.value }
      this.spinner.show();

      if(this.f.funcao.value == Funcao.Palestrante){
        this.palestranteService.post().subscribe(
          () => this.toaster.success('Função Palestrante Ativada', 'Sucesso'),
          (error) => {
            this.toaster.error('Erro ao ativar função Palestrante', 'Erro');
            console.error(error);
          }
        )
      }

      this.accountService.updateUser(this.userUpdate).subscribe(
        () => this.toaster.success('Usuário atualizado!', 'Sucesso'),
        (error) => {
          this.toaster.error(error.error);
          console.error(error);
        },
      ).add(() => this.spinner.hide())
    }
  }

  public resetForm(event: any): void {
    event?.preventDefault();
    this.form.reset();
  }

  public cssValidator(campoForm: FormControl): any{
    return {'is-invalid': campoForm.errors && campoForm.touched};
  }
}
