import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridOptions, ValueFormatterParams } from 'ag-grid-community';
import { PublicacionService } from '../../services/publicacion.service';
import { Publicacion } from '../../models/publicacion.model';

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
  imports: [AgGridModule, NgIf, NgFor, FormsModule],
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
  };

  columnDefs: ColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
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

  constructor(private publicacionService: PublicacionService) {}

  ngOnInit(): void {
    this.loadPublicaciones();
  }

  onFiltroChange(): void {
    this.loadPublicaciones();
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
