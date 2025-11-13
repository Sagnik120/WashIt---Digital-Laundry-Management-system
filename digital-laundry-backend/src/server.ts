
import { app } from './app.js';
import { env } from './config/env.js';

app.listen(env.PORT, () => {
  console.log(`Laundry API running on http://localhost:${env.PORT}`);
});
