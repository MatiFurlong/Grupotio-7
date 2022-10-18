
const API = 'https://62b8b874f4cb8d63df61cdd0.mockapi.io/Apitabla';
const contenedor = document.getElementById('tablaApi');
let resultados = '';
let opcion = '';
let handler;




const mostrar = (articulos) => {
    articulos.forEach(articulo => {
        resultados += `<tr>
                            <td>${articulo.id}</td>
                            <td>${articulo.Destinos}</td>
                            <td>${articulo.precios}</td>
                            <td>${articulo.fechas}</td>
                            <td><button onclick="editar(${articulo.id})">Editar</button>
                            <td><button data-id="${articulo.id}" class:"borrar">Borrar</button>
                            </tr>
                    `
    })
    contenedor.innerHTML = resultados
}


function agregarFila(datos) {


    let fila = crearFila();
    let celda_id = crearCelda(datos.id);
    fila.appendChild(celda_id);

    let celda_dest = crearCelda(datos.Destinos);
    fila.appendChild(celda_dest);

    let celda_prec = crearCelda(datos.precios);
    fila.appendChild(celda_prec);

    let celda_fecha = crearCelda(datos.fechas);
    fila.appendChild(celda_fecha);

    let td = document.createElement("td");
    let btn_editar = document.createElement("button");
    btn_editar.innerHTML = "Editar fila";
    btn_editar.id = datos.id;
    btn_editar.addEventListener("click", editarDato);
    td.appendChild(btn_editar);
    fila.appendChild(td);

    td = null;
    td = document.createElement("td");
    let btn_borrar = document.createElement("button");
    btn_borrar.innerHTML = "Borrar fila";
    btn_borrar.id = datos.id;
    btn_borrar.addEventListener("click", borrarDato);
    td.appendChild(btn_borrar);
    fila.appendChild(td);

    contenedor.appendChild(fila);

}

async function editarDato() {
    let id = this.id;

    let td = this.parentElement;
    let fila = td.parentElement;

    let destinos_value = fila.children[1].innerHTML;
    let precios_value = fila.children[2].innerHTML;
    let fechas_value = fila.children[3].innerHTML;


    fila.children[1].innerHTML = "";
    let destinos_input = document.createElement("input");
    destinos_input.value = destinos_value;
    fila.children[1].appendChild(destinos_input);


    fila.children[2].innerHTML = "";
    let precios_input = document.createElement("input");
    precios_input.value = precios_value;
    fila.children[2].appendChild(precios_input);


    fila.children[3].innerHTML = "";
    let fechas_input = document.createElement("input");
    fechas_input.value = fechas_value;
    fila.children[3].appendChild(fechas_input);

    fila.classList.add("en_modificacion");

    this.innerHTML = "Confirmar cambios";
    this.removeEventListener("click", editarDato);

    this.addEventListener("click", handler = () => {
        let dato = {
            Destinos: destinos_input.value,
            precios: precios_input.value,
            fechas: fechas_input.value,
        }

        modificarDato(dato, id);
    });
}


async function modificarDato(dato, id) {
    try {
        let res = await fetch(API + "/" + id, {
            'method': 'PUT',
            'headers': {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dato),
        });
        if (res.ok) {
            console.log('Modificado!');
            let final = await res.json();

            let fila = document.querySelector(".en_modificacion");
            fila.classList.remove("en_modificacion");

            fila.children[1].innerHTML = final.Destinos;
            fila.children[2].innerHTML = final.precios;
            fila.children[3].innerHTML = final.fechas;

            let boton = fila.children[4].firstChild;

            boton.innerHTML = "Editar fila";
            boton.removeEventListener("click", handler);
            boton.addEventListener("click", editarDato);

        }
    } catch (error) {
        console.log(error);
    }
}

function crearFila() {
    let fila = document.createElement("tr");
    return fila;
}

function crearCelda(info) {
    let celda = document.createElement("td");
    celda.innerHTML = info;
    return celda;
}



async function enviar() {
    let destino = document.querySelector('#destino');
    let fecha = document.querySelector('#fecha');
    let precio = document.querySelector('#precio');

    let datos = {
        'Destinos': destino.value,
        'fechas': fecha.value,
        'precios': precio.value
    }
    try {
        let res = await fetch(API, {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': JSON.stringify(datos)
        });

        if (res.status === 201) {
            // console.log('Creado!');
        }
    } catch (error) {
        console.log(error);
    }
}

async function borrarDato(id_param = null, boton_param = null) {
    let id;
    if (id_param == null) {
        id = this.id;
    } else {
        id = id_param;
    }
    
    let boton;
    if (boton_param == null) {
        boton = this;
    } else {
        boton = boton_param;
    }

    try {
        let res = await fetch(API + "/" + this.id, {
            'method': 'DELETE',
            'headers': {
                'Content-Type': 'application/json'
            },
        });
        if (res.ok) {
            console.log('Borrado!');
            borrarFila(boton);

        }
    } catch (error) {
        console.log(error);
    }
};

function borrarFila(boton) {
    let td = boton.parentElement;
    let fila = td.parentElement;
    fila.remove();
}

function borrarTodo() {

    let children = contenedor.children;
    for (var i = 0; i < children.length; i++) {
        let fila = children[i];
        borrarDato(fila.children[0].innerHTML, fila.children[4].firstChild);
    }
}

document.querySelector("#borrar").addEventListener("click", borrarTodo);


async function traerDatos() {
    try {
        let res = await fetch(API, {
            'method': 'GET',
            'headers': {
                'Content-Type': 'application/json'
            },
        });
        if (res.ok) {
            let final = await res.json();
            final.forEach(dato => {
                agregarFila(dato);
            });
        }
    } catch (error) {
        console.log(error);
    }
}

document.querySelector("#cargar").addEventListener("click", cargarDatoDesdeInput);

async function cargarDatoDesdeInput() {

    let destino = document.querySelector("#destino");
    let fecha = document.querySelector("#fecha");
    let precio = document.querySelector("#precio");

    let dato = {
        'Destinos': destino.value,
        'fechas': fecha.value,
        'precios': precio.value
    }


    try {
        let res = await fetch(API, {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dato),

        });
        if (res.ok) {
            let final = await res.json();
            agregarFila(final);

            destino.value = "";
            fecha.value = "";
            precio.value = "";
        }
    } catch (error) {
        console.log(error);
    }
}

async function cargarEjemplo() {
    let destino = document.querySelector('#destino');
    let fecha = document.querySelector('#fecha');
    let precio = document.querySelector('#precio');

    let datos = {
        'Destinos': "Jamaica",
        'fechas': "18/7",
        'precios': "2000"
    }
    try {
        let res = await fetch(API, {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': JSON.stringify(datos)
        });

        if (res.status === 201) {
            let final = await res.json();
            agregarFila(final);
        }
    } catch (error) {
        console.log(error);
    }
}

document.querySelector("#btnCrear").addEventListener("click", cargarEjemplo);



traerDatos();

















































