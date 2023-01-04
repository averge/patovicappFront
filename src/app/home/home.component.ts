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

  eventoActual:any=null

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
  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;
  
ngOnInit() {
  //this.test();
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
  console.log(this.eventoActual)
  this.eventosService.asistentesde(this.eventoActual.id).subscribe(
    (data:any)=>{
      if(data.length>0){
        this.eventoSinAsistentes=true
        this.ListadoDni=data
        this.dataSource = new MatTableDataSource(this.ListadoDni);
        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator
        this.dataSource.sort = this.sort;
        this.cdr.detectChanges();
      }else{
        this.eventoSinAsistentes=false
      }
    }
  )
}

cambioDeEvento(any:any){
  this.eventoActual=this.eventos[any]
  this.eventosService.asistentesde(this.eventos[any].id).subscribe(
    (data:any)=>{
      if(data.length>0){
        this.eventoSinAsistentes=true
        this.ListadoDni=data
        this.dataSource = new MatTableDataSource(this.ListadoDni);
        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator
        this.dataSource.sort = this.sort;
        this.cdr.detectChanges();
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
      const dni = {dni : result}
      this.servicio.scanPersona(dni).subscribe(
        (res:any) => {
          if(res == 1){
            alert("DNI ya registrado");
          }else{
            alert("DNI escaneado correctamente")
            this.test()
          }
        }
      )
  } );
}
applyFilter() {
  this.dataSource.filter = this.buscarValue.value.trim().toLowerCase();
  this.cdr.detectChanges();
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort;
  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }

}
buscar(){
  let isnum = /^\d+$/.test(this.buscarValue.value);
  if(isnum){
    this.ListadoDnivalid = this.ListadoDni.filter(person => person.dni.includes( this.buscarValue.value));
  }else{
    this.ListadoDnivalid = this.ListadoDni.filter(person => person.nombre.toUpperCase().includes(this.buscarValue.value.toUpperCase()));
  }
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
    /*
    const dni={
      dni: persona.dni
    }
    this.servicio.eliminarPersona(dni).subscribe(
      (res:any) => {
        console.log(res)
        console.log("eliminado correctamente")
        alert ("eliminado correctamente")
        this.test()
      }
    )
    */
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
  //read file from input
  const fileReaded = fileInput.target.files[0];
  let error=""
  let reader: FileReader = new FileReader();
  reader.readAsText(fileReaded);
  
   reader.onload = (e) => {
   let csv: any = reader.result;
   let allTextLines = csv.split(/\r|\n|\r/);
   let headers = allTextLines[0].split(',');

  
    for (let i = 1; i < allTextLines.length; i++) {
      // split content based on comma
      let data = allTextLines[i].split(',');
      if (data.length === headers.length) {
        let tarr = {nombre:data[0], dni:data[1], scaneado:false};
        if(data[1].length!=8){
          console.log(error)
          error=error + " El DNI de " + data[0] + " no es valido "+ "\n"
          console.log(error)
        }
        if(data[0].length==0){
          error=error + " El DNI " + data[1] + " no tiene nombre"+ "\n"
        }
       /* for (let j = 0; j < headers.length; j++) {
          console.log(data[j]);
          tarr.push(data[j]);
        }
        tarr.push(false)
  */
       // log each row to see output 
       var repetidos: any[] =[]
       this.servicio.agregarPersona(tarr).subscribe(
        (res:any) => {
          if(res==0){
            this.test()
            alert("Personas agregadas")
          }else{
            this.arr.push(res)
          }
        }
       )
    }
   }
   if (error!=""){
     alert(error)
     fileInput.target.value = null
   }else{
   // all rows in the csv file 
   // this.arr=lines;
    this.ListadoDnivalid=this.ListadoDni;
  }
  } 
  
  }

test(){
  this.servicio.listado().subscribe((data:any)=>{

    this.ListadoDni=data;
    this.dataSource = new MatTableDataSource(this.ListadoDni);
    this.cdr.detectChanges();
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort;
  }
  )

}

agregarPersona(){
  console.log(this.eventoActual)
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
      //this.test()
    }
}
  )}


  filtroEscaneadas(){
    if(this.escaneados.value=="todas"){
      this.dataSource.data=this.ListadoDni
    }
    if(this.escaneados.value=="escaneados"){
      this.dataSource.data = this.ListadoDni.filter((person:any) => person.scan==1)
    }
    if(this.escaneados.value=="sin_escanear"){
      this.dataSource.data = this.ListadoDni.filter((person:any) => person.scan==0)
    }
        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator
        this.dataSource.sort = this.sort;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  eliminarEvento(){
    var e:any
    if(confirm(
      "¿Está seguro que desea eliminar el evento " + this.eventoActual.evento + "?"
    )){
      this.eventosService.eliminarEvento(this.eventoActual.id).subscribe(
        (res:any) => {
          
          alert ("eliminado correctamente")
          if(this.eventos.length>1){
            console.log(this.eventos)
            console.log(this.eventoActual)
            for (let i=0; this.eventos.length; i++){
              if(this.eventos[i].id==this.eventoActual.id){
                e=this.eventos[i-1]
                this.eventos.splice(i,1)

              }
           }
          }
         this.actualizarEventos()
         this.cdr.detectChanges();
          this.eventoActual=e
         this.actualizaListaAsistentes()
        }
      )  
  }
  }
}
