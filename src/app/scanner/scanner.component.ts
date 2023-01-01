import { BarcodeFormat } from '@zxing/library';
import { Component, Inject, OnInit, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ListadoService } from 'src/services/listado.service';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.css']
})
export class ScannerComponent implements OnInit {
  ListadoDni: string[] = [];
  public cameras:MediaDeviceInfo[]=[];
  public myDevice!: MediaDeviceInfo;
  public scannerEnabled=false;
  public results:string[]=[];
  Validado=false
  dni:any;
  public activas: FormControl = new FormControl(false);
  public formats = [BarcodeFormat.CODE_128, BarcodeFormat.EAN_8, BarcodeFormat.EAN_13, BarcodeFormat.QR_CODE, BarcodeFormat.PDF_417];

  constructor(private servicio: ListadoService,public dialogRef: MatDialogRef<ScannerComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  camerasFoundHandler(cameras: MediaDeviceInfo[]){
    this.cameras=cameras;
    this.selectCamera(this.cameras[0].label);
  }

  cancelar(){
    this.dialogRef.close();
  }
  scanSuccessHandler(event:string){

    //this.results.unshift(event);
    const temp=event.split(/[@]/)
    this.results.unshift(temp[2]);
    this.dialogRef.close(temp[4]);
    
  }

  agregarDni(){
    this.ListadoDni.push(this.dni);
    this.Validado=false;
    this.dni=null
  }

  verificaNumero(){
    this.Validado=false
    this.dni=this.dni.replace(/\D/g, "")
    if(this.dni.length==8){
      this.Validado=true;
    }
  }

  selectCamera(cameraLabel: string){    
    this.cameras.forEach(camera=>{
      if(camera.label.includes(cameraLabel)){
        this.myDevice=camera;
        console.log(camera.label);
        this.scannerEnabled=true;
        console.log(this.myDevice);
      }
    })    
  }
 
 
}
