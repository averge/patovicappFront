import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { BarcodeFormat } from '@zxing/library';
import { EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ScannerComponent } from './../scanner/scanner.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ListadoService } from 'src/services/listado.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator} from '@angular/material/paginator';
import { NuevaPersonaComponent } from './../nueva-persona/nueva-persona.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NeweventComponent } from '../eventos/newevent/newevent.component';
import { EventosService } from 'src/services/eventos.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  datasources:any[]=[]
  eventoActual:any=null
  personasNoAgregadasPorErrores:any=[]
  mostrarPersonasConErrores=false
  ListadoDni: any[] = []
  dataSource:any
  //[{dni:"40476372", nombre:"Augusto", scaneado:false},{dni:"40676855", nombre:"Pedro", scaneado:false},{dni:"39786141", nombre:"Fede", scaneado:false},{dni:"39963623", nombre:"Willi", scaneado:false},{dni:"41006154", nombre:"Loren", scaneado:false}];
  ListadoDnivalid: any[]  = [];
  nuevaPersona = new FormGroup(
    {nombre : new FormControl('', [Validators.required]),
    dni : new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(8)])}
  )
  arr:any[] = [];
  eventoSinAsistentes=false
  usuarioSinEventos=false
  public results:string[]=[];
  validoDni=false
  validoNombre=false
  dni:any;
  idActual:any
  nombre=null
  eventos:any[]=[]
  public buscarValue: FormControl = new FormControl(null);
  public escaneados: FormControl = new FormControl("todas");
  public formats = [BarcodeFormat.CODE_128, BarcodeFormat.EAN_8, BarcodeFormat.EAN_13, BarcodeFormat.QR_CODE, BarcodeFormat.PDF_417];

  constructor(private eventosService: EventosService,private activeoute: ActivatedRoute, private router: Router,private cdr: ChangeDetectorRef,private servicio: ListadoService, public dialog: MatDialog) {}
  displayedColumns: string[] = ['nombre', 'dni', 'eliminar'];       
  @ViewChild(MatSort, {static: false}) sort!: MatSort;  
  @ViewChild(MatPaginator, {static:false}) paginator!: MatPaginator;
ngOnInit() {
  this.eventosService.eventosDe(localStorage.getItem("id")).subscribe(
    (data:any)=>{
      if (data.length>0){
        
        this.usuarioSinEventos=true
        this.eventos=data;
        this.eventoActual=this.eventos[0]
        this.actualizaListaAsistentes()
        }else{
          this.usuarioSinEventos=false
        }
      }
  )
}
actualizarEventos(){
  this.eventosService.eventosDe(localStorage.getItem("id")).subscribe(
    (data:any)=>{
      if (data.length>0){
        this.usuarioSinEventos=true
        this.eventos=data;
        this.eventoActual=this.eventos[0]
        this.actualizaListaAsistentes()
        }else{
          this.usuarioSinEventos=false
        }
      }
  )
}
actualizaListaAsistentes(){
  this.eventosService.asistentesde(this.eventoActual.id).subscribe(
    
    (data:any)=>{
      if(data.length>0){
        this.eventoSinAsistentes=true
        this.dataSource = new MatTableDataSource(data);
        this.at()
       }else{
        this.eventoSinAsistentes=false
      }
    }
  )
}
at(){
  this.cdr.detectChanges();
  this.dataSource.paginator = this.paginator
  this.dataSource.sort = this.sort;
}


cambioDeEvento(any:any){
  this.eventoActual=this.eventos[any]
  this.eventosService.asistentesde(this.eventos[any].id).subscribe(
    (data:any)=>{
      this.dataSource=null
      if(data.length>0){
        this.eventoSinAsistentes=true
        this.dataSource = new MatTableDataSource(data);
        this.at()
      }else{
        this.eventoSinAsistentes=false
      }
    }

  )
  

}

  verificaNombre(){
    this.validoNombre=false
    if(this.nombre!=null || this.nombre!=""){
      this.validoNombre=true;
    }
  }

  verificaNumero(){
    this.nuevaPersona.controls['dni'].setValue(this.nuevaPersona.controls['dni'].value.replace(/\D/g, ""))
  }


  scannear(){
  const dialogRef = this.dialog.open(ScannerComponent, {
    disableClose: true,
    panelClass: 'js-dialog',  data: {}   
  });
  dialogRef.afterClosed().subscribe(result => {
    console.log(result)
    if (!result === true ) return;
      const persona={
        dni: result,
        id_evento:this.eventoActual.id
      }
      console.log(persona)
      this.eventosService.scanPersona(persona).subscribe(
        (res:any) => {
          if(res == 0){
            alert("no existe la persona en el evento")
          }
          if(res == 1){
            alert("La persona ya fue escaneada");
          }
          if(res == 2){
            alert("La persona fue escaneada correctamente")
            this.actualizaListaAsistentes()
          }
        })
    })
  }





applyFilter() {
  this.dataSource.filter = this.buscarValue.value.trim().toLowerCase();
  this.at()
}

eliminar(){
  this.ListadoDni.splice(0,1);
}
eliminarPersona(persona:any){
  if(confirm(
    "¿Está seguro que desea eliminar a " + persona.nombre + "?"
  )){
    this.eventosService.eliminarAsistente(persona.id).subscribe(
      (res:any) => {
        alert ("eliminado correctamente")
        this.actualizaListaAsistentes()
      }
    )
  }
  

  
}

cerrarSesion(){
      this.router.navigate(['/login']);
}

agregarEvento(){
  const dialogRef = this.dialog.open(NeweventComponent,{
    disableClose: true,
    panelClass: 'js-dialog',  data: {}
  });
  dialogRef.afterClosed().subscribe(result => {
    console.log(result)
    if (!result === true ) return;
    if (result){
      this.eventosService.eventosDe(localStorage.getItem("id")).subscribe(
        (data:any)=>{
          if (data.length>0){
          this.usuarioSinEventos=true
          this.eventos=data;
          }
        })
    }
})
  }

csv2Array(fileInput: any){
  this.mostrarPersonasConErrores=false
  //read file from input
  const fileReaded = fileInput.target.files[0];
  let error=""
  var conErrores: any[]=[]
  let reader: FileReader = new FileReader();
  reader.readAsText(fileReaded);
  
   reader.onload = (e) => {
   let csv: any = reader.result;
   let allTextLines = csv.split(/\r|\n|\r/);
   let headers = allTextLines[0].split(',');
    let sum=0
  
    for (let i = 0; i < allTextLines.length; i++) {
      // split content based on comma
      let data = allTextLines[i].split(',');
      if (data.length === headers.length) {
        let personaNueva = {nombre:data[0], dni:data[1], id_evento:this.eventoActual.id};
        if(data[1].length!=8 || data[0].length==0){
          let perosnaConError= {nombre:data[0], dni:data[1], id_evento:this.eventoActual.id, error:"Datos con errores"}
          this.personasNoAgregadasPorErrores.push(perosnaConError)
          this.mostrarPersonasConErrores=true
        }else{
          this.eventosService.agregarAsistente(personaNueva).subscribe(
            (res:any) => {
              if (res==0){
                sum++
              }else{
                let perosnaConError= {nombre:data[0], dni:data[1], id_evento:this.eventoActual.id, error:"Persona ya registrada"}
                this.personasNoAgregadasPorErrores.push(perosnaConError)
                this.mostrarPersonasConErrores=true
              }
            }
           )
        }
       
    }
   }
   alert(sum+" personas agregadas a la lista")
   this.actualizaListaAsistentes()
   if (error!=""){
     alert(error)
     fileInput.target.value = null
   }else{
    this.actualizaListaAsistentes()
  }
  } 
  
  }


agregarPersona(){
  const dialogRef = this.dialog.open(NuevaPersonaComponent, {
    disableClose: true,
    
    panelClass: 'js-dialog',  data: {data:this.eventoActual}   
  });
  dialogRef.afterClosed().subscribe(result => {
    console.log(result)
    if (!result === true ) return;
    if (result){
      alert("nueva persona agregada")
      this.actualizaListaAsistentes()
    }
}
  )}


  filtroEscaneadas(){
    if(this.escaneados.value=="todas"){
      this.actualizaListaAsistentes()
    }
    if(this.escaneados.value=="escaneados"){
      this.dataSource.data = this.dataSource.data.filter((person:any) => person.scan==1)
    }
    if(this.escaneados.value=="sin_escanear"){
      this.dataSource.data = this.dataSource.data.filter((person:any) => person.scan==0)
    }
    this.at()
  }
  limpiaFiltro(){
    console.log(this.escaneados)
    this.escaneados.setValue("todas")
    this.buscarValue.setValue("")
    console.log(this.escaneados)

    this.actualizaListaAsistentes()
  }

  eliminarEvento(){

    if(confirm(
      "¿Está seguro que desea eliminar el evento " + this.eventoActual.evento + "?"
    )){
      this.eventosService.eliminarEvento(this.eventoActual.id).subscribe(
        (res:any) => {
          alert ("eliminado correctamente")
         window.location.reload()
        }
      )  
  }
  }
}
