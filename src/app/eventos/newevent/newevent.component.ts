import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventosService } from 'src/services/eventos.service';

@Component({
  selector: 'app-newevent',
  templateUrl: './newevent.component.html',
  styleUrls: ['./newevent.component.css']
})
export class NeweventComponent implements OnInit {

  constructor(private eventService: EventosService,public dialogRef: MatDialogRef<NeweventComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  event = new FormGroup(
    {evento : new FormControl('', [Validators.required]),
    id_usuario:new FormControl(localStorage.getItem("id"))}
  )
  ngOnInit(): void {
  }
  agregarEvento(){
    console.log(this.event.value);
    this.eventService.agregarEvento(this.event.value).subscribe(
      (data:any)=>{
        console.log(data);
        this.dialogRef.close(true);
      }
    )
  }

  cancelar(){
    this.dialogRef.close();
  }
}
