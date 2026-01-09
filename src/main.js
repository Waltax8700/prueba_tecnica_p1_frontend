import { createApp } from 'vue'
import App from './App.vue'

// PrimeVue
import PrimeVue from 'primevue/config'

// Estilos
import 'primevue/resources/themes/saga-blue/theme.css'  // tema
import 'primevue/resources/primevue.css'                // base styles
import 'primeicons/primeicons.css'                      // íconos
import 'primeflex/primeflex.css'                        // utilidades flex

const app = createApp(App)

app.use(PrimeVue)

app.mount('#app')
