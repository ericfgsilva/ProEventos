import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Palestrante } from '@app/models/Palestrante';
import { PalestranteService } from '@app/services/palestrante.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, map, tap } from 'rxjs';

@Component({
  selector: 'app-palestrante-detalhe',
  templateUrl: './palestrante-detalhe.component.html',
  styleUrls: ['./palestrante-detalhe.component.scss']
})
export class PalestranteDetalheComponent implements OnInit {

  public form!: FormGroup;
  palestranteUpdate = {} as Palestrante;
  public situacaoDoForm = '';
  public corDaDescricao = '';

  constructor(
    private fb: FormBuilder,
    public palestranteService: PalestranteService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.validation();
    this.verificaForm();
    this.carregarPalestrante();
  }

  private validation(): void {
    this.form = this.fb.group({
      miniCurriculo: [''],
    });
  }

  public get f(): any {
    return this.form.controls;
  }

  private carregarPalestrante(): void{
    this.spinner.show();
    this.palestranteService.getPalestrante().subscribe(
      (palestranteRetorno: Palestrante) => {
        this.form.patchValue(palestranteRetorno);
      },
      (error: any) => {
        console.error(error);
        this.toastr.error('Palestrante não carregado', 'Erro');
      }
    )
    .add(() => this.spinner.hide());
  }

  private verificaForm(): void {

    this.form.valueChanges
    .pipe(
      map(() => {
        this.situacaoDoForm = 'Minicurrículo está sendo atualizado...';
        this.corDaDescricao = 'text-warning';
      }),
      debounceTime(1000),
      tap(() => this.spinner.show())
    ).subscribe(
      () => {
          this.palestranteService
            .put({ ...this.form.value })
            .subscribe(
              () => {
                this.situacaoDoForm = 'Minicurrículo foi atualizado!';
                this.corDaDescricao = 'text-success';

                setTimeout(() => {
                  this.situacaoDoForm = 'Minicurrículo foi carregado!';
                  this.corDaDescricao = 'text-success';
                }, 2000);
            },
            () => {
              this.toastr.error('Erro ao tentar atualizar minicurrículo!', 'Erro');
            }
          )
          .add(() => this.spinner.hide())
        }
      );
  }

}
