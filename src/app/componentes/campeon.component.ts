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
  public campeones: any;
  public estaticos: any = [
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

  /*La app maneja 2 estados, currentStatus = 1 -> la app se encuentra en modo de creación?? de documentos, ó currentStatus = 0 -> la app se encuentra en modo de edición?? de documentos. */
  public currentStatusCampeon = 1; //1 CREA, 0 EDITA
  public newCampeonForm = new FormGroup({
    nombre: new FormControl("", Validators.required),
    id: new FormControl("")
    //al enviar los datos del formulario, hay que agregar los CONTADORES
  });

  /* VARIABLES PARA AGREGAR O EDITAR ASPECTO */
  /*La app maneja 2 estados, currentStatus = 0 -> la app se encuentra en modo de creación?? de documentos, ó currentStatus = 1 -> la app se encuentra en modo de edición?? de documentos. */
  public currentStatusAspecto = 1; //1 EDITA, 0 CREA
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
    //el ngOnInit es el que invoca al servicio para LEER datos de BDD
    this.lecturaDatosFirebase();
  }

  /*###### FUNCIONES ######*/

  //Funcion que lee los datos de FB y los almacena en la variable campeones[]
  lecturaDatosFirebase() {
    console.log("lecturaDatosFirebase()");
    //en esta llamada al servicio, si no hay datos en firebase
    //entonces this.campeones es undefined
    this._campeonService.getCampeones().subscribe(
      campeonesSnapshot => {
        //inicializa el arreglo de campeones como vacio
        this.campeones = [];
        //itera por cada campeon en firebase
        campeonesSnapshot.forEach((campeonData: any) => {
          //agrega el campeon al arreglo
          this.campeones.push({
            id: campeonData.payload.doc.id, //documentId del documento
            data: campeonData.payload.doc.data() //datos del data
          });
        });
      },
      err => {
        console.log(err);
      }
    );
    if (this.campeones == null) {
      console.log("campeones es null");
      //this.mostrarEnviar = true;
      //this.mostrarFormatear = false;
    } else {
      if (this.campeones.length > 0) {
        console.log("campeones leidos de firebase:", this.campeones.length);
        //this.mostrarEnviar = false;
        //this.mostrarFormatear = true;
      }
    }
  }

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

  public buscarCampeon(ide: number) {
    for (let i = 0; i < this.campeones.length; i++) {
      if (this.campeones[i].id == ide) {
        return this.campeones[i];
      }
    }
    return null;
  }

  public newAspecto(form, documentId = this.documentId) {
    console.log(`Status: ${this.currentStatusAspecto}`);

    if (this.currentStatusAspecto == 1) {
      //EDICION DE DOCUMENTOS
      let data_aspecto = {
        //datos del formulario de nuevo aspecto
        id: form.id,
        nombre_aspecto: <string>form.nombre_aspecto,
        tipo: <string>form.tipo,
        precio: <number>form.precio,
        obtenible: form.obtenible,
        posesion: form.posesion,
        botin: form.botin,
        id_campeon: form.id_campeon
      };
      console.log("datos del aspecto: ", data_aspecto);
      //traer datos del campeon que recibira el nuevo aspecto
      let campeon_nuevaskin = this.buscarCampeon(this.idChamp_recibeskin);
      if (campeon_nuevaskin != null) {
        //si encuentra el campeon, se agregan los datos del formulario al array Aspectos
        campeon_nuevaskin.aspectos.push(data_aspecto);
        //PENDIENTE: ACTUALIZAR CONTADORES DEL CAMPEON
        /**cont_obtenible ++ si amerita
        cont_posesion ++ si amerita //cuantas tengo
        cont_botin ++ si amerita*/

        //UNA VEZ LA INFORMACION ESTA LISTA, SE ACTUALIZA EL CAMPEON
        //convertir campeon a JSON
        let champ_json = JSON.stringify(campeon_nuevaskin);
        this._campeonService.updateCampeon(documentId, champ_json).then(
          () => {
            //apagar interrumptor nuevo aspecto
            this.currentStatusAspecto = 0;
            //limpiar formulario
            this.newAspectoForm.setValue({
              id: 0,
              nombre_aspecto: "",
              tipo: "",
              precio: 0,
              obtenible: null,
              posesion: null,
              botin: null,
              id_campeon: 0
            });
            console.log("Documento de campeon + aspecto editado exitosamente.");
          },
          error => {
            console.log(error);
          }
        );
      } else {
        alert("campeon para nueva skin, no existe");
      }
      /*NO QUIERO CREAR UN NUEVO CAMPEON SINO EDITARLO*/
      //EDICION DE DOCUMENTOS (solo implica modificar el array aspectos)
    } else {
      console.log("modo creacion aspecto: ", this.currentStatusAspecto);
    }
  }
}
