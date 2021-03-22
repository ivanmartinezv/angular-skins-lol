export class Aspecto {
  nombre_aspecto: string;
  tipo: string;
  precio: number;
  obtenible: boolean;
  posesion: boolean;
  botin: boolean;
  id_campeon: string; //documentId

  constructor() {}
  /*constructor(
    na: string,
    t: string,
    p: number,
    o: boolean,
    po: boolean,
    b: boolean,
    idc: string
  ) {
    this.nombre_aspecto = na;
    this.tipo = t;
    this.precio = p;
    this.obtenible = o;
    this.posesion = po;
    this.botin = b;
    this.id_campeon = idc;
  }*/
}
