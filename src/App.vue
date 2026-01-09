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
    </div>

    <DataTable :value="equiposFiltrados" responsiveLayout="scroll">
      <Column field="id" header="ID" />
      <Column field="codigo" header="Código" />
      <Column field="tipo" header="Tipo" />
      <Column field="cliente" header="Cliente" />
      <Column field="estado" header="Estado" />
      <Column field="fecha_entrega" header="Fecha de Entrega" />
    </DataTable>
  </div>
</template>

<script>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

export default {
  components: { DataTable, Column },
  data() {
    return {
      equipos: [],
      filtroCodigo: '',
      filtroCodigos: '',
      codigosFiltrados: []
    }
  },
  computed: {
    equiposFiltrados() {
      return this.equipos.filter(eq => {
        const codigoMatch = eq.codigo.toLowerCase().includes(this.filtroCodigo.toLowerCase());
        const codigosMatch = this.codigosFiltrados.length === 0 
          ? true 
          : this.codigosFiltrados.some(codigo => eq.codigo.toLowerCase() === codigo.toLowerCase());

        return codigoMatch && codigosMatch;
      });
    }
  },
  mounted() {
    fetch('http://185.241.151.197:8000/api/equipos')
      .then(response => response.json())
      .then(data => {
        this.equipos = data.data;
      })
      .catch(error => console.error('Error al obtener los equipos:', error))
  },
  methods: {
    aplicarFiltros() {
      this.codigosFiltrados = this.filtroCodigos
        .split('\n')
        .map(linea => linea.trim())
        .filter(linea => linea.length > 0);

        console.log(this.codigosFiltrados);
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
</style>