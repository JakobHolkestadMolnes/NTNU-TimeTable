import express from 'express';
import http from 'http';
import Logging from './library/Logging';
import config from './config/config';
import lectureRoutes from './routes/lecture';
import {prisma} from './config/client';

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Comments API',
        version: '1.0.0',
        description: 'Comments API',
    },
};

const options = {
    swaggerDefinition,
    apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

const {
    config: { port }
} = config;
const router = express();


router.use(async (req, res, next) => {
    /** Log the request */
    Logging.info(`Incoming -> Method: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);
    
    res.on('finish', () => {
        Logging.info(`Outgoing -> Method: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`);
    });
    next();
});

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
        return res.status(200).json({});
    }

    next();
});

/** Routes */
router.use('/api/v1/lectures', lectureRoutes);

/** Healthcheck */
router.get('/ping', (req, res) => {
    res.status(200).json({ message: 'pong' });
});

router.get('/', (req, res) => {
    res.sendFile(__dirname + '/pages/index.html');
});
router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


/** Error handling */
router.use((req, res, next) => {
    const error = new Error('Not found');
    Logging.error(error);
    

    return res.status(404).json({ message: error.message });
});

/** Start the server */
http.createServer(router).listen(port, () => {
    Logging.info(`Server started on http://localhost:${port}`);
});
