import { Component, OnInit } from "@angular/core";
//formularios
import {
  FormControl,
  FormGroup,
  Validators /*, FormBuilder*/
} from "@angular/forms";
//import {FormsModule,ReactiveFormsModule} from '@angular/forms';

//modelos

//servicios
import { AspectoService } from "../servicios/aspecto.service";
import { CampeonService } from "../servicios/campeon.service";

@Component({
  selector: "app-campeon",
  templateUrl: "../vistas/campeon.component.html",
  styleUrls: ["../css/campeon.component.css"]
})

//COMPONENTE CREADO PARA IMPLEMENTAR UN MODELO NO RELACIONAL DE DATOS
export class CampeonComponent implements OnInit {
  public titulo: string = "Titulo del campeon component";
  public contador_obtenibles: number = 0;
  public contador_posesion: number = 0;
  public contador_botin: number = 0;

  public campeones: any = [
    {
      id: 1,
      nombre: "Aatrox",
      aspectos: [
        {
          nombre_aspecto: "Aatrox Luna de Sangre",
          tipo: "Epica",
          precio: 1350,
          obtenible: true,
          posesion: false,
          botin: false,
          id_campeon: 1
        }
      ],
      cont_obtenible: 0,
      cont_posesion: 0,
      cont_botin: 0
    },
    {
      id: 2,
      nombre: "Ahri",
      aspectos: [],
      cont_obtenible: 0,
      cont_posesion: 0,
      cont_botin: 0
    }
  ];

  constructor(
    private _campeonService: CampeonService,
    private _aspectoService: AspectoService
  ) {}

  ngOnInit() {
    console.log("ngOnInit()");
  }

  lecturaDatosEstaticos() {
    let largo: number = 10;
    for (let i = 0; i < largo; i++) {
      this.campeones[i] = "perro";
    }
  }

  lecturaDatosFirebase() {}
}
