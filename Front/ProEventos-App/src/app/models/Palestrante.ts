import { RedeSocial } from "./RedeSocial";

export interface Palestrante {
  Id: number;
  Nome: string;
  MiniCurriculo: string;
  ImagemURL: string;
  Telefone: string;
  Email: string;
  RedesSociais: RedeSocial[];
  PalestrantesEventos: Palestrante[];
}
