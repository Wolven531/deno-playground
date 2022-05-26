import { serve } from 'https://deno.land/std@0.140.0/http/server.ts';
import { httpRequestHandler } from './handlers.ts';

const env = Deno.env.toObject();

const PORT = parseInt(env.PORT ?? '8080');

console.log(`Starting HTTP webserver; access it at http://localhost:${PORT}`);

await serve(httpRequestHandler, { port: PORT });
