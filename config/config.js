const VHOST_PROTOCOL     = process.env.VHOST_PROTOCOL;
const VHOST              = process.env.VHOST;
const PORT               = process.env.PORT;
const DOCS_PORT          = process.env.DOCS_PORT;

const POSTGRES_HOST      = process.env.POSTGRES_HOST;
const POSTGRES_DB        = process.env.POSTGRES_DB;
const POSTGRES_SSL       = process.env.POSTGRES_SSL;
const POSTGRES_USER      = process.env.POSTGRES_USER;
const POSTGRES_PASSWORD  = process.env.POSTGRES_PASSWORD;

const bodyParser = {
    json: {
        extended: false,
        type: 'application/json',
        limit: "2mb"
    }
};

const response = {
    //global req response headers
    headers: [
        ["Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE, CONNECT"],
    ]
};

module.exports = {
    exitOnInitError: true,
    apps: {
        bowling: {
            baseUrl: `${VHOST_PROTOCOL}://${VHOST}:${PORT}`,
            listen: PORT,
            stopOnError: true,
            bodyParser: bodyParser,
            response: response,
            doc: {
                baseUrl: `${VHOST_PROTOCOL}://${VHOST}:${DOCS_PORT}`,
                listen: DOCS_PORT,
                title: "bowling-api-docs",
                stopOnError: true
            }
        }
    },
    storage: {
        postgres: {
            host: POSTGRES_HOST,
            ssl: POSTGRES_SSL,
            databases: {
                main: {
                    db: POSTGRES_DB,
                    username: POSTGRES_USER,
                    password: POSTGRES_PASSWORD
                }
            }
        }
    },
    logs: {
        // whether a process will exit with status code 1 on 'uncaughtException' event
        exitOnError: false,
        transports: [
            {
                type: 'file',
                level: 'info', // maximum log level of this sepecific transport, [optional]
                json: false,
                priority: 0,
                dir: 'logs', // can be absolute or relative to the node's process
                autocreate: true // whether the `dir` should be created if it does not exist
            },
            {
                type: 'console',
                level: 'info',
                priority: 1
            }
        ]
    }
};
