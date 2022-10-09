'use strict'
const http = require ('http');
const {bodyParser} = require ('./lib/bodyParser.js');
const port = 3000;
let database = [];
// Obtener todos los datos
function getTaskHandler (request, response) {
    response.writeHead (200, {
        'Content-Type': 'application/json'
    });
    response.write (JSON.stringify (database));
    response.end ();
}
// Insertar registro de datos
async function createTaskHandler (request, response) {
    try {
        await bodyParser (request);
        console.log (request.body);

        database.push (request.body);
        response.writeHead (200, {
            'Content-Type': 'application/json'
        });
        response.write ('POST received');
        response.end ();
    } 
    catch (error) {
        response.writeHead (200, {
            'Content-Type': 'text/plain'
        });
        response.write ('Invalid Data');
        response.end ();
    }
}
// Actualiza registro de datos (Se recomienda mandar peticion en forma de consulta)
async function updateTaskHandler (request, response) {
    try {
        let {url} = request;
        console.log (url);
        let idQuery = url.split ('?') [1];
        let idKey = idQuery.split ('=') [0];
        let idValue = idQuery.split ('=') [1];
        if (idKey === "id") {
            await bodyParser (request);
            database [idValue - 1] = request.body;
            response.writeHead (200, {
                'Content-Type': 'application/json'
            });
            response.write ('PUT received');
            response.end ();
        }
        else {
            response.writeHead (200, {
                'Content-Type': 'application/json'
            });
            response.write ('Invalid request query');
            response.end ();
        }
    } 
    catch (err) {
        console.log (err.message);
        response.writeHead (400, {
            'Content-Type': 'text/plain'
        });
        response.write ('Invalid body data was provided', err.message);
        response.end ();
    }
}
// Borrar registro de datos
async function deleteTaskHandler (request, response) {
    let {url} = request;
    console.log (url);
    let idQuery = url.split ('?') [1];
    let idKey = idQuery.split ('=') [0];
    let idValue = idQuery.split ('=') [1];
    if (idKey === "id") {
        database.splice (idValue - 1, 1);
        response.writeHead (200, {
            'Content-Type': 'text/plain'
        });
        response.write ('DELETE Successfully');
        response.end ();
    }
    else {
        response.writeHead (400, {
            'Content-Type': 'text/plain'
        });
        response.write ('Invalid request query');
        response.end ();
    }
}
// Inicializar servidor
const server = http.createServer ((req, res) => {
    const {url, method} = req;
    // console.log (req);
    console.log (`URL: ${url} Method: ${method}`);
    switch (method) {
        case "GET":
            if (url === '/') {
                res.writeHead (200, {
                    'Content-Type': 'application/json'
                });
                res.write (JSON.stringify (database));
                res.end ();
            }
            if (url === '/tasks') {
                getTaskHandler (req, res);
            }
            break;
        case "POST":
            if (url === '/tasks') {
                createTaskHandler (req, res);
            }
            break;
        case "PUT":
            updateTaskHandler (req, res);
            break;
        case "DELETE":
            deleteTaskHandler (req, res);
    }
});
server.listen (port);
console.log ('Server on port', port);