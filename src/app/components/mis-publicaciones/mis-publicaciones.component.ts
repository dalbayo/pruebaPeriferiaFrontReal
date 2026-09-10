import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AgGridModule } from 'ag-grid-angular';
import {
  CellClickedEvent,
  ColDef,
  GridOptions,
  ValueFormatterParams,
} from 'ag-grid-community';
import { PublicacionService } from '../../services/publicacion.service';
import { Publicacion } from '../../models/publicacion.model';
import { PublicacionFormDialogComponent } from '../../dialogs/publicacion-form-dialog/publicacion-form-dialog.component';
import { DeleteDialogComponent } from '../../dialogs/delete-dialog/delete-dialog.component';

const ESTADO_LABELS: Record<number, string> = {
  0: 'Borrador',
  1: 'Publicado',
  2: 'Archivado',
};

/** 0 = todas, 1 = mis publicaciones, 2 = publicaciones de otros usuarios (debe coincidir con backend) */
export const FILTRO_TIPOS = [
  { valor: 0, etiqueta: 'Todas las publicaciones' },
  { valor: 1, etiqueta: 'Mis publicaciones' },
  { valor: 2, etiqueta: 'Publicaciones de otros usuarios' },
];

@Component({
  selector: 'app-mis-publicaciones',
  standalone: true,
  imports: [
    AgGridModule,
    NgIf,
    NgFor,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
  ],
  templateUrl: './mis-publicaciones.component.html',
  styleUrls: ['./mis-publicaciones.component.scss'],
})
export class MisPublicacionesComponent implements OnInit {
  rowData: Publicacion[] = [];
  loading = false;
  errorMessage = '';

  filtroTipos = FILTRO_TIPOS;
  tipoSeleccionado = 0;

  gridOptions: GridOptions = {
    pagination: true,
    paginationPageSize: 10,
    rowHeight: 50,
    defaultColDef: {
      sortable: true,
      filter: true,
      resizable: true,
      floatingFilter: true,
    },
    onCellClicked: (event: CellClickedEvent) => {
      if (event.colDef.field !== 'acciones') {
        return;
      }
      const boton = (event.event?.target as HTMLElement)?.closest('button');
      const accion = boton?.getAttribute('data-action');
      if (accion === 'editar') {
        this.abrirEditarPublicacion(event.data as Publicacion);
      } else if (accion === 'eliminar') {
        this.confirmarEliminarPublicacion(event.data as Publicacion);
      }
    },
  };

  columnDefs: ColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 190,
      sortable: false,
      filter: false,
      cellRenderer: () =>
        '<button class="btn btn-sm btn-outline-primary me-1" type="button" data-action="editar">Editar</button>' +
        '<button class="btn btn-sm btn-outline-danger" type="button" data-action="eliminar">Eliminar</button>',
    },
    {
      field: 'titulo',
      headerName: 'Título',
      filter: 'agTextColumnFilter',
      flex: 2,
    },
    {
      field: 'resumen',
      headerName: 'Resumen',
      filter: 'agTextColumnFilter',
      flex: 2,
    },
    {
      field: 'estado',
      headerName: 'Estado',
      width: 130,
      valueFormatter: (params: ValueFormatterParams) =>
        ESTADO_LABELS[params.value] ?? params.value,
    },
    { field: 'fechaPublicacion', headerName: 'Fecha publicación', width: 170 },
    { field: 'creadoEn', headerName: 'Creado en', width: 170 },
  ];

  constructor(
    private publicacionService: PublicacionService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadPublicaciones();
  }

  onFiltroChange(): void {
    this.loadPublicaciones();
  }

  abrirCrearPublicacion(): void {
    const dialogRef = this.dialog.open(PublicacionFormDialogComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((creada) => {
      if (creada) {
        this.loadPublicaciones();
      }
    });
  }

  abrirEditarPublicacion(publicacion: Publicacion): void {
    const dialogRef = this.dialog.open(PublicacionFormDialogComponent, {
      width: '600px',
      data: { publicacion },
    });

    dialogRef.afterClosed().subscribe((actualizada) => {
      if (actualizada) {
        this.loadPublicaciones();
      }
    });
  }

  confirmarEliminarPublicacion(publicacion: Publicacion): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        message: `¿Deseas eliminar la publicación "${publicacion.titulo}"?`,
      },
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado?.clicked === 'submit') {
        this.eliminarPublicacion(publicacion.id);
      }
    });
  }

  private eliminarPublicacion(id: number): void {
    this.errorMessage = '';
    this.publicacionService.eliminarPublicacion(id).subscribe({
      next: () => this.loadPublicaciones(),
      error: (err) => {
        this.errorMessage =
          err?.error?.message || 'No se pudo eliminar la publicación.';
      },
    });
  }

  loadPublicaciones(): void {
    this.loading = true;
    this.errorMessage = '';
    this.publicacionService.getPublicaciones(this.tipoSeleccionado).subscribe({
      next: (publicaciones) => {
        this.rowData = publicaciones;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage =
          err?.error?.message || 'No se pudieron cargar las publicaciones.';
        this.loading = false;
      },
    });
  }
}
