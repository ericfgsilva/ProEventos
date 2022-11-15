import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})
export class EventoDetalheComponent implements OnInit {

  //formulario: FormGroup;
  formulario!: FormGroup;

  constructor() {
    //this.formulario = new FormGroup({})
  }

  ngOnInit(): void {
    this.validation();

  }

  public validation(): void{
    this.formulario = new FormGroup({
      tema: new FormControl('',
        [Validators.required, Validators.minLength(4), Validators.maxLength(50)]
      ),
      local: new FormControl('', Validators.required),
      dataEvento: new FormControl('',
        [Validators.required, Validators.maxLength(120000)]
      ),
      qtdPessoas: new FormControl('', Validators.required),
      telefone: new FormControl('', Validators.required),
      email: new FormControl('',
        [Validators.required, Validators.email]
      ),
      imageURL: new FormControl('', Validators.required),
      imageAlt: new FormControl('', Validators.required),
    })
  }


}
