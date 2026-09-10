import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridOptions, ValueFormatterParams } from 'ag-grid-community';
import { PublicacionService } from '../../services/publicacion.service';
import { Publicacion } from '../../models/publicacion.model';

const ESTADO_LABELS: Record<number, string> = {
  0: 'Borrador',
  1: 'Publicado',
  2: 'Archivado',
};

@Component({
  selector: 'app-mis-publicaciones',
  standalone: true,
  imports: [AgGridModule, NgIf],
  templateUrl: './mis-publicaciones.component.html',
  styleUrls: ['./mis-publicaciones.component.scss'],
})
export class MisPublicacionesComponent implements OnInit {
  rowData: Publicacion[] = [];
  loading = false;
  errorMessage = '';

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

  loadPublicaciones(): void {
    this.loading = true;
    this.errorMessage = '';
    this.publicacionService.getMisPublicaciones().subscribe({
      next: (publicaciones) => {
        this.rowData = publicaciones;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage =
          err?.error?.message || 'No se pudieron cargar tus publicaciones.';
        this.loading = false;
      },
    });
  }
}
