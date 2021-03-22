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
import { ModalService } from "../servicios/modal.service";

@Component({
  selector: "app-campeon",
  templateUrl: "../vistas/campeon.component.html",
  styleUrls: ["../css/campeon.component.css"],
  providers: [ModalService]
})

//COMPONENTE CREADO PARA IMPLEMENTAR UN MODELO NO RELACIONAL DE DATOS
export class CampeonComponent implements OnInit {
  public titulo: string = "Titulo del campeon component";
  public contador_obtenibles: number = 0;
  public contador_posesion: number = 0;
  public contador_botin: number = 0;

  //(I) Array que contendrá los datos de firebase
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
  public cant_campeones: number;

  //(II) atributos para editar campeones
  public documentId = null;

  /*La app maneja 2 estados, currentStatus = 0 -> la app se encuentra en modo de creación?? de documentos, ó currentStatus = 1 -> la app se encuentra en modo de edición?? de documentos. */
  public currentStatusCampeon = 1;
  public newCampeonForm = new FormGroup({
    nombre: new FormControl("", Validators.required),
    id: new FormControl("")
    //al enviar los datos del formulario, hay que agregar los CONTADORES
  });

  /* VARIABLES PARA AGREGAR O EDITAR ASPECTO */
  /*La app maneja 2 estados, currentStatus = 0 -> la app se encuentra en modo de creación?? de documentos, ó currentStatus = 1 -> la app se encuentra en modo de edición?? de documentos. */
  public currentStatusAspecto = 1;
  public agregarAspecto: boolean = false;
  public idChamp_recibeskin: number = 0;
  public newAspectoForm = new FormGroup({
    id: new FormControl(""),
    nombre_aspecto: new FormControl("", Validators.required),
    tipo: new FormControl("", Validators.required),
    precio: new FormControl(0, Validators.required),
    obtenible: new FormControl(null, Validators.required),
    posesion: new FormControl(null, Validators.required),
    botin: new FormControl(null, Validators.required),
    id_campeon: new FormControl(0, Validators.required)
    //al enviar los datos del formulario, hay que actualizar los CONTADORES
  });

  constructor(
    private _campeonService: CampeonService,
    private _aspectoService: AspectoService,
    public _modalService: ModalService
  ) {
    //funcion con los datos que trae el servicio
    this.newCampeonForm.setValue({
      id: "",
      nombre: ""
    });
  }

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

  //METODOS PARA ABRIR Y CERRAR EL MODAL
  openModal(id) {
    //id: string
    this._modalService.open(id);
  }

  closeModal(id) {
    //id: string
    this._modalService.close(id);
  }

  //CRUD DE CAMPEON
  public newCampeon(form, documentId = this.documentId) {
    console.log(`Status: ${this.currentStatusCampeon}`);
    if (this.currentStatusCampeon == 1) {
      //CREACION DE DOCUMENTOS
      let data = {
        //datos del formulario
        nombre: <string>form.nombre,
        url: <string>form.url,
        aspectos: {},
        cont_obtenible: 0,
        cont_posesion: 0,
        cont_botin: 0
      };
      this._campeonService.createCampeon(data).then(
        () => {
          console.log("Documento creado exitosamente.");
          //reiniciar formulario
          this.newCampeonForm.setValue({
            nombre: "",
            url: "",
            id: ""
          });
          //si la bdd está vacia y agrego el primer campeon
          //this.mostrarEnviar = false; //no deberia enviar
          //this.mostrarFormatear = true; //permito formatear
        },
        error => {
          console.error(error);
        }
      );
    } else {
      //EDICION DE DOCUMENTOS (solo implica modificar nombre y/o url)
      let data = {
        nombre: <string>form.nombre,
        url: <string>form.url
      };
      this._campeonService.updateCampeon(documentId, data).then(
        () => {
          this.currentStatusCampeon = 1;
          this.newCampeonForm.setValue({
            nombre: "",
            url: "",
            id: ""
          });
          console.log("Documento editado exitosamente.");
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  //CRUD DE ASPECTO
  public agregaAspecto(ide: number) {
    //cambiar valor de verdad
    this.agregarAspecto = true;
    this.idChamp_recibeskin = ide;
  }

  public newAspecto(form, documentId = this.documentId) {
    console.log(`Status: ${this.currentStatusCampeon}`);
    if (this.currentStatusCampeon == 1) {
      //CREACION DE DOCUMENTOS
      let data = {
        //datos del formulario
        nombre: <string>form.nombre,
        url: <string>form.url,
        aspectos: {},
        cont_obtenible: 0,
        cont_posesion: 0,
        cont_botin: 0
      };
      this._campeonService.createCampeon(data).then(
        () => {
          console.log("Documento creado exitosamente.");
          //reiniciar formulario
          this.newCampeonForm.setValue({
            nombre: "",
            url: "",
            id: ""
          });
          //si la bdd está vacia y agrego el primer campeon
          //this.mostrarEnviar = false; //no deberia enviar
          //this.mostrarFormatear = true; //permito formatear
        },
        error => {
          console.error(error);
        }
      );
    } else {
      //EDICION DE DOCUMENTOS (solo implica modificar nombre y/o url)
      let data = {
        nombre: <string>form.nombre,
        url: <string>form.url
      };
      this._campeonService.updateCampeon(documentId, data).then(
        () => {
          this.currentStatusCampeon = 1;
          this.newCampeonForm.setValue({
            nombre: "",
            url: "",
            id: ""
          });
          console.log("Documento editado exitosamente.");
        },
        error => {
          console.log(error);
        }
      );
    }
  }
}
