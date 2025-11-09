import app from './app.js'
import { PORT } from './config/config.js';

app.listen(PORT) 
console.log("el servidor funciona en el puerto",PORT);
