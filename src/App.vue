<template>
  <div class="p-m-4">
    <h2>Equipos</h2>

    <!-- Filtros -->
    <div class="filtros">
      <input 
        type="text" 
        v-model="filtroCodigo" 
        placeholder="Filtrar por cadena"
      />
      <textarea 
        v-model="filtroCodigos" 
        placeholder="Filtrar por códigos (uno por línea)" 
        rows="4"
      ></textarea>
      <button @click="aplicarFiltros">Filtrar</button>
      <button @click="mostrarDialog = true" style="margin-left: 1rem;">Añadir Equipo</button>
    </div>

    <DataTable :value="equiposFiltrados" responsiveLayout="scroll">
      <Column field="id" header="ID" />
      <Column field="codigo" header="Código" />
      <Column field="tipo" header="Tipo" />
      <Column field="cliente" header="Cliente" />
      <Column field="estado" header="Estado" />
      <Column field="fecha_entrega" header="Fecha de Entrega" />
    </DataTable>

    <!-- Dialogo para añadir equipo -->
    <Dialog header="Añadir Equipo" v-model:visible="mostrarDialog" modal>
      <div class="form-group">
        <label>Código</label>
        <input type="text" v-model="nuevoEquipo.codigo" />
      </div>
      <div class="form-group">
        <label>Tipo</label>
        <input type="text" v-model="nuevoEquipo.tipo" />
      </div>
      <div class="form-group">
        <label>Cliente</label>
        <input type="text" v-model="nuevoEquipo.cliente" />
      </div>
      <div class="form-group">
        <label>Estado</label>
        <input type="text" v-model="nuevoEquipo.estado" />
      </div>
      <div class="form-group">
        <label>Fecha de Entrega</label>
        <input type="date" v-model="nuevoEquipo.fecha_entrega" />
      </div>

      <div style="margin-top: 1rem; text-align: right;">
        <button @click="mostrarDialog = false" style="margin-right: 0.5rem;">Cancelar</button>
        <button @click="crearEquipo">Guardar</button>
      </div>
    </Dialog>
  </div>
</template>

<script>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import { API_BASE_URL } from './config.js';

export default {
  components: { DataTable, Column, Dialog },
  data() {
    return {
      equipos: [],
      filtroCodigo: '',
      filtroCodigos: '',
      codigosFiltrados: [],
      mostrarDialog: false,
      nuevoEquipo: {
        codigo: '',
        tipo: '',
        cliente: '',
        estado: '',
        fecha_entrega: ''
      }
    }
  },
  computed: {
    equiposFiltrados() {
      return this.equipos.filter(eq => {
        const codigo = eq.codigo || '';
        const codigoMatch = codigo.toLowerCase().includes(this.filtroCodigo.toLowerCase());
        const codigosMatch = this.codigosFiltrados.length === 0 
          ? true 
          : this.codigosFiltrados.some(codigo => eq.codigo.toLowerCase() === codigo.toLowerCase());

        return codigoMatch && codigosMatch;
      });
    }
  },
  mounted() {
    this.obtenerEquipos();
  },
  methods: {
    async aplicarFiltros() {
      this.codigosFiltrados = this.filtroCodigos
        .split('\n')
        .map(linea => linea.trim())
        .filter(linea => linea.length > 0);

      if (this.codigosFiltrados.length === 0) {
        alert('Ingresa al menos un código.');
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/validar-equipos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ codigos: this.codigosFiltrados })
        });

        if (!response.ok) throw new Error('Error al validar los equipos');

        const data = await response.json();

        const encontrados = data.encontrados || [];
        const noEncontrados = data.no_encontrados || [];

        this.equiposFiltrados = this.equipos.filter(eq =>
          encontrados.includes(eq.codigo)
        );

        if (noEncontrados.length > 0) {
          alert(`Códigos no encontrados: ${noEncontrados.join(', ')}`);
        }
      } catch (error) {
        console.error(error);
        alert('Error al validar los equipos.');
      }
    },
    obtenerEquipos() {
      fetch(`${API_BASE_URL}/equipos`)
        .then(response => response.json())
        .then(data => {
          this.equipos = data.data;
        })
        .catch(error => console.error('Error al obtener los equipos:', error))
    },
    async crearEquipo() {
      try {
        const response = await fetch(`${API_BASE_URL}/crear`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.nuevoEquipo)
        });

        if (!response.ok) throw new Error('Error al crear el equipo');

        await this.obtenerEquipos();
        this.mostrarDialog = false;

        // Limpiar formulario
        this.nuevoEquipo = { codigo: '', tipo: '', cliente: '', estado: '', fecha_entrega: '' };
      } catch (error) {
        console.error(error);
        alert('No se pudo crear el equipo.');
      }
    }
  }
}
</script>

<style scoped>
  .filtros {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .filtros input,
  .filtros textarea {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 0.9rem;
  }

  .filtros textarea {
    resize: none;
  }

  .filtros button {
    padding: 0.5rem 1rem;
    background-color: #1976d2;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.2s;
  }

  .filtros button:hover {
    background-color: #115293;
  }

  .form-group {
    margin-bottom: 0.75rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.25rem;
    font-weight: bold;
  }

  .form-group input {
    width: 100%;
    padding: 0.5rem;
    box-sizing: border-box;
  }
</style>