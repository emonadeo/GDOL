import express from 'express';
import cors from 'cors';
import { createOpenApiExpressMiddleware } from 'trpc-openapi';

import { router } from '@gdol/server';

const server = express();

server.use(cors());
server.use(createOpenApiExpressMiddleware({ router }));

server.listen(3000);
