import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ListadoService } from 'src/services/listado.service';

@Component({
  selector: 'app-nueva-persona',
  templateUrl: './nueva-persona.component.html',
  styleUrls: ['./nueva-persona.component.css']
})
export class NuevaPersonaComponent implements OnInit {
  nuevaPersona = new FormGroup(
    {nombre : new FormControl('', [Validators.required]),
    dni : new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(8)])}
  )

  validoDni=false
  validoNombre=false
  dni:any;
  nombre=null
  constructor(private servicio: ListadoService,public dialogRef: MatDialogRef<NuevaPersonaComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
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

  cancelar(){
    this.dialogRef.close();
  }

  agregarDni(){

      const persona={
        nombre: this.nuevaPersona.controls['nombre'].value,
        dni: this.nuevaPersona.controls['dni'].value
      }
      this.servicio.agregarPersona(persona).subscribe(
        (data) => {
          if(data==0){
            this.dialogRef.close(true);
          }else{
            alert("error la persona ya esta en la lista")
          }
        }
      )
    
  }

}
