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
  public dniNuevo: FormControl = new FormControl('',[Validators.required, Validators.maxLength(8),Validators.minLength(8)])
  public scannerEnabled=false;
  public results:string[]=[];
  Validado=false
  dni:any;
  public activas: FormControl = new FormControl(false);
  public formats = [BarcodeFormat.CODE_128, BarcodeFormat.EAN_8, BarcodeFormat.EAN_13, BarcodeFormat.QR_CODE, BarcodeFormat.PDF_417];

  constructor(private servicio: ListadoService,public dialogRef: MatDialogRef<ScannerComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }
  scan(){
    console.log(this.dniNuevo.value)
    this.dialogRef.close(this.dniNuevo.value);
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



  verificaNumero(){
    this.dniNuevo.setValue(this.dniNuevo.value.replace(/\D/g, ""))
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
