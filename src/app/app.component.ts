import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { BarcodeFormat } from '@zxing/library';
import { EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ScannerComponent } from './scanner/scanner.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ListadoService } from 'src/services/listado.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator} from '@angular/material/paginator';
import { NuevaPersonaComponent } from './nueva-persona/nueva-persona.component';
import { Route } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  
}
