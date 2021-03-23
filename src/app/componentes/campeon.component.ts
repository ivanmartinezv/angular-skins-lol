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
  public documentId: string = null;

  /*La app maneja 2 estados, currentStatus = 1 -> la app se encuentra en modo de creación?? de documentos, ó currentStatus = 0 -> la app se encuentra en modo de edición?? de documentos. */
  public currentStatusCampeon = 1; //1 CREA, 0 EDITA
  public newCampeonForm = new FormGroup({
    nombre: new FormControl("", Validators.required),
    id: new FormControl("")
    //al enviar los datos del formulario, hay que agregar los CONTADORES
  });

  /* VARIABLES PARA AGREGAR O EDITAR ASPECTO */
  //(II bis) atributos para crear aspectos
  public idChamp_recibeskin: string = null;
  public agregarAspecto: boolean = false;

  /*La app maneja 2 estados, currentStatus = 0 -> la app se encuentra en modo de creación?? de documentos, ó currentStatus = 1 -> la app se encuentra en modo de edición?? de documentos. */
  public currentStatusAspecto = 1; //1 EDITA, 0 CREA
  public newAspectoForm = new FormGroup({
    id: new FormControl(""),
    nombre_aspecto: new FormControl("", Validators.required),
    tipo: new FormControl("", Validators.required),
    precio: new FormControl(0, Validators.required),
    obtenible: new FormControl(null, Validators.required),
    posesion: new FormControl(null, Validators.required),
    botin: new FormControl(null, Validators.required),
    id_campeon: new FormControl(
      "" /*, Validators.required NO PORQUE SE CONOCE AL PRESIONAR EL BOTON ADD SKIN*/
    )
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

        if (this.campeones == null) {
          console.log("campeones es null");
          this.campeones.length = null;
        } else {
          if (this.campeones.length > 0) {
            this.cant_campeones = this.campeones.length;
            console.log("campeones leidos de firebase:", this.campeones.length);
          }
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  //CRUD DE CAMPEON
  public newCampeon(form, documentId = this.documentId) {
    console.log("documentID: ", documentId);
    console.log("Status campeon: ", this.currentStatusCampeon);

    if (this.currentStatusCampeon == 1) {
      //CREACION DE DOCUMENTOS (id y objeto)
      let array: {}[] = [
        //array de {}
        /*{}, {}, {}*/
      ];
      let data = {
        //datos del formulario
        nombre: <string>form.nombre,
        aspectos: array, //era array, le habia puesto null
        cont_obtenible: 0,
        cont_posesion: 0,
        cont_botin: 0
      };
      //PRIMER SERVICIO
      this._campeonService.createCampeon(data).then(
        () => {
          console.log("Documento de campeon creado exitosamente.");
          //limpiar formulario
          this.newCampeonForm.setValue({
            nombre: "",
            id: ""
          });
          //alert("Campeon agregado exitosamente");
          //si la bdd está vacia y agrego el primer campeon
          //se crea la coleccion campeones??
        },
        error => {
          console.error(error);
        }
      );
    } else {
      //EDICION DE DOCUMENTOS (solo implica modificar nombre)
      let data = {
        nombre: <string>form.nombre
        //Y EL RESTO DE ATRIBUTOS QUE ONDA?? SE MANTIENE O ELIMINA
      };
      //TERCER SERVICIO
      this._campeonService.updateCampeon(documentId, data).then(
        () => {
          //reinicia status y limpia formulario
          this.currentStatusCampeon = 1;
          this.newCampeonForm.setValue({
            id: "",
            nombre: ""
          });
          console.log("Documento de campeon editado exitosamente.");
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  //ESTE METODO CARGA EN EL FORMULARIO LOS DATOS DEL CAMPEON A EDITAR
  //NO LOS MODIFICA
  public editCampeon(documentId) {
    console.log("editCampeon(documentId):", documentId);
    //SEGUNDO SERVICIO
    let editSubscribe = this._campeonService
      .getCampeon(documentId)
      .subscribe(campeon => {
        //CAMBIAR EL INTERRUPTOR A MODO EDICION = 2
        this.currentStatusCampeon = 2;
        this.documentId = documentId;
        this.newCampeonForm.setValue({
          id: documentId,
          nombre: campeon.payload.data()["nombre"]
        });
        editSubscribe.unsubscribe();
      });
  }

  public deleteCampeon(documentId) {
    console.log("deleteCampeon(documentId):", documentId);
    this._campeonService.deleteCampeon(documentId).then(
      () => {
        console.log("Documento eliminado!");
      },
      error => {
        console.error(error);
      }
    );
  }

  //CRUD DE ASPECTO
  public agregaAspecto(ide: string) {
    //cambiar valor de verdad
    this.agregarAspecto = true;
    //captura el documentID del campeon que recibira un aspecto
    this.idChamp_recibeskin = ide;
  }

  public buscarCampeon(ide: string) {
    console.log("campeon a buscar: ", ide);
    console.log("largo de campeones para buscar: ", this.cant_campeones);
    let i = 0;
    //campeones es la coleccion de documentos
    while (this.campeones[i] != null) {
      if (this.campeones[i].id == ide) {
        console.log("campeon encontrado!!");
        //retorna campeon si el ide coincide con el id de algun documento
        return this.campeones[i];
      }
      i++;
    }
    /*for (let i = 0; i < this.cant_campeones; i++) {
      //campeones es la coleccion de documentos
      if (this.campeones[i].id == ide) {
        console.log("campeon encontrado!!");
        //retorna campeon si el ide coincide con el id de algun documento
        return this.campeones[i];
      }
    }*/
    return null;
  }

  public newAspecto(form, documentId = this.idChamp_recibeskin) {
    console.log("newAspecto(formulario y docID capturado:", form, documentId);
    console.log(`Status: ${this.currentStatusAspecto}`);

    if (this.currentStatusAspecto == 1) {
      //EDICION DE DOCUMENTOS
      let data_aspecto = {
        //datos del formulario de nuevo aspecto
        //id: form.id,
        nombre_aspecto: <string>form.nombre_aspecto,
        tipo: <string>form.tipo,
        precio: <number>form.precio,
        obtenible: form.obtenible,
        posesion: form.posesion,
        botin: form.botin,
        id_campeon: documentId //form.id_campeon NO
      };
      console.log("datos del aspecto: ", data_aspecto);
      //traer datos del campeon que recibira el nuevo aspecto
      console.log("ide del campeon que recibira skin: ", documentId);
      let campeon_nuevaskin = this.buscarCampeon(documentId);

      if (campeon_nuevaskin != null) {
        //EXISTEN DATOS EN LO QUE ESTOY TRAYENDO?
        console.log("campeon al que le voy a dar skin: ", campeon_nuevaskin);
        console.log(
          "campeon.data al que le voy a dar skin: ",
          campeon_nuevaskin.data
        );

        /*if (campeon_nuevaskin.data.aspectos == null) {
          campeon_nuevaskin.data.aspectos = [];
        }*/
        console.log(
          "tiene su array de aspectos declarado??: ",
          campeon_nuevaskin.data.aspectos
        );

        console.log(
          "tamaño undefined o numerico?: ",
          campeon_nuevaskin.data.aspectos.length
        );
        let cant_aspectos_previa_nueva = campeon_nuevaskin.data.aspectos.length;
        //crear array auxiliar de tamaño: actual+1
        let campeon_skins_aux = [cant_aspectos_previa_nueva + 1];
        //recorrer auxiliar y agregar aspectos actuales y dejar ultimo vacio
        for (let j = 0; j < cant_aspectos_previa_nueva; j++) {
          campeon_skins_aux[j] = campeon_nuevaskin.data.aspectos[j];
        }
        //se agregan los datos del formulario al final del array Aspectos
        campeon_skins_aux[cant_aspectos_previa_nueva] = data_aspecto;
        /*campeon_nuevaskin.data.aspectos.push(data_aspecto);SOLO SI SE USABA JSON*/

        //se actualiza el array con el nuevo aspecto
        campeon_nuevaskin.data.aspectos = campeon_skins_aux;

        //PENDIENTE: ACTUALIZAR CONTADORES DE campeon_nuevaskin CON 3 IF
        if (data_aspecto.obtenible) {
          campeon_nuevaskin.data.cont_obtenible++;
        }
        if (data_aspecto.posesion) {
          campeon_nuevaskin.data.cont_posesion++;
        }
        if (data_aspecto.botin) {
          campeon_nuevaskin.data.cont_botin++;
        }
        //UNA VEZ LA INFORMACION ESTA LISTA, SE ACTUALIZA EL CAMPEON COMPLETO
        //(1 falla) convertir documento con campeon completo a JSON?? NO
        //let data_updated_champ_json = JSON.stringify(campeon_nuevaskin);

        //(2 ha fallado) convertir campeon.data a JSON?? maybe SI, falla.
        //let data_updated_champ_json = JSON.stringify(campeon_nuevaskin.data);
        //como que convierte mal el documento.data a json y el updateservice falla
        //console.log("campeon con el nuevo aspecto: ", data_updated_champ_json);

        //(3 pendiente) crear un {} con los datos del campeon + array aspectos actualizado
        let updated_data = {
          //datos del campeon
          nombre: campeon_nuevaskin.data.nombre,
          //aspectos actualizados del campeon
          aspectos: campeon_nuevaskin.data.aspectos, //era array, le habia puesto null
          //contadores actualizados
          cont_obtenible: campeon_nuevaskin.data.cont_obtenible,
          cont_posesion: campeon_nuevaskin.data.cont_posesion,
          cont_botin: campeon_nuevaskin.data.cont_botin
        };

        //XXX SERVICIO: SI BIEN ESTE SERVICIO EDITA INFORMACION DE UN CAMPEON,
        //SE CONSIDERA COMO QUE ESTA CREANDO UN NUEVO ASPECTO EN LA BDD
        this._campeonService
          .updateCampeonSkin(documentId, updated_data) //recibe ID:string y DATA:{}
          .then(
            () => {
              //apagar interrumptor crear aspecto de campeon
              this.currentStatusAspecto = 1;
              //limpiar formulario
              this.newAspectoForm.setValue({
                id: "",
                nombre_aspecto: "",
                tipo: "",
                precio: 0,
                obtenible: null,
                posesion: null,
                botin: null,
                id_campeon: ""
              });
              //limpiar idChamp_recibeskin
              this.idChamp_recibeskin = "";
              console.log(
                "Documento de campeon + aspecto editado exitosamente."
              );
              //alert("Aspecto agregado exitosamente");
              //cambiar valor de verdad
              this.agregarAspecto = false;
            },
            error => {
              console.log(error);
            }
          );
      } else {
        console.log("el campeon para nueva skin, no existe");
      }
      /*NO QUIERO CREAR UN NUEVO CAMPEON SINO EDITARLO*/
      //EDICION DE DOCUMENTOS (solo implica modificar el array aspectos)
    } else {
      //UN BOTON DE LA VISTA, DEBERIA CAMBIAR EL CURRENT A 2 Y ASI ENTRARIA A ESTE ELSE
      //ESE BOTON DEBERIA PERMITIR EDITAR LOS DATOS DE ALGUN ASPECTO YA EXISTENTE
      console.log("modo creacion aspecto: ", this.currentStatusAspecto);
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
}
