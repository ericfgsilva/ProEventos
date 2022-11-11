import { Lote } from "./Lote";
import { Palestrante } from "./Palestrante";
import { RedeSocial } from "./RedeSocial";

export interface Evento {
  Id: number;
  Local: string;
  DataEvento?: Date;
  Tema: string;
  QtdPessoas: number;
  ImageURL: string;
  ImageAlt: string;
  Telefone: string;
  Email: string;
  Lotes: Lote[];
  RedesSociais: RedeSocial[];
  PalestrantesEventos: Palestrante[];
}
