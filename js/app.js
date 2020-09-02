// Variables //
const cursos = document.getElementById('cursos');
const carrito = document.getElementById('carrito');
const listaCarrito = document.querySelector('#listaCarrito tbody');
const vaciarCarrito = document.querySelector('#vaciar');
const contador = document.querySelector('#contador');
// --------------------------- //

// Eventos de click y del DOM //
EventListeners();

function EventListeners(){
    // Iniciamos el evento click para agregar el curso al carrito de compras //
    cursos.addEventListener('click', ComprarCurso);
    
    // Iniamos el evento click para eliminar un curso del carrto de compras //
    carrito.addEventListener('click', BorrarCurso);
    
    // Iniciamos el evento click para elimiar todos los cursos del carrito de compras //
    vaciarCarrito.addEventListener('click', vaciarTodo);
    
    // Iniciamos el evento DOMContentLoaded para leer los cursos almacenados en el localStorage //
    document.addEventListener('DOMContentLoaded', leerLS);
}
// --------------------------- //

// Funciones //
function ComprarCurso(e){
    e.preventDefault();
    // Utilizamos la delegación para determinar la acción del botón y leer los datos del curso //
        if(e.target.classList.contains('agregar-carrito')){
            // Obtenemos el DIV completo del curso para leer sus datos, IMG, Título, Précio y ID //
            const curso = e.target.parentElement.parentElement.parentElement;
            // Función para leer los datos del DIV seleccionado //
            leerDatos(curso);
        }
}

// Función para leer los datos //
function leerDatos(curso){
    // Con esta función leémos los datos del elemento DIV seléccionado //
    infoCursos = {
        // Accedemos a la etiqueta IMG y obtenemos su SRC //
        img: curso.querySelector('img').src,

        // Accedemos a la etiqueta P y obtenemos su texto //
        titulo: curso.querySelector('p').textContent,

        // Accedemos a la etiqueta (a) mediante su clase (.precio) para obtener su texto //
        precio: curso.querySelector('.precio').textContent,

        // Accedemos a la etiqueta (button) y obtenemos su atributo (data-id) para identificar cada elemento //
        id: curso.querySelector('button').getAttribute('data-id')
    }
    
    // Se llama a la función que se encarga de insertar los cursos dentro del carrito de compras //
    insertarCarrito(infoCursos);
}

// Función para insertar los cursos dentro del carrito de compras //
function insertarCarrito(curso){
    // Creamos un elemento de tipo (tr) para insertar los cursos dentro de la tabla //
    const row = document.createElement('tr');

    // Obtenemos el ID del DIV contenedor de los botones //
    const botones = document.getElementById('botones');

    // Enlazamos y agregamos los datos obtenidos del curso hacia el carrito de compras //
    row.innerHTML = `
    

    <td><img src="${curso.img}" width="100"></td>
    <td>${curso.titulo}</td>
    <td>${curso.precio}</td>
    <td>
        <a href="#" class="borrar-curso" data-id="${curso.id}">
        X</a>
    </td>

    `
    // Enlazamos y agregamos los botones de pago o volver //
    botones.innerHTML = `
    
    <a class="btn btn-success" href="">Pagar cursos</a>
    <a class="btn btn-secondary" href="">Seguir comprando</a>

    `

    // Agregamos el resultado del curso hacia la tabla del carrito de compras
    listaCarrito.appendChild(row);

    // Guardamos el resultado del curso directo al localStorage //
    guardarLocalStorage(curso);

}

// Función para borrar el curso seléccionado //
function BorrarCurso(e){
    // Llamamos a 2 variables para realizar la función //
    let curso, cursoID;
    e.preventDefault();

    // Comparamos el ID del curso seleccionado con el que esta almacenado en el localStorage //
    if(e.target.classList.contains('borrar-curso')){
        // Esta opción es opcional, .remove() solo se encarga de borrar el elemento del DOM //
        e.target.parentElement.parentElement.remove();

        // Obtenemos el elemento completo del curso para borrarlo con todos sus datos completamente //
        curso = e.target.parentElement.parentElement;

        /* Obtenemos el atributo ID del elemento (a) para realizar la comparación del ID seléccionado
        con el ID almacenado */
        cursoID = curso.querySelector('a').getAttribute('data-id');

        // Llamamos la función para borrar el elemento del localStorage //
        borrarLocalStorage(cursoID);
    }

}

// Función para borrar todos los cursos del carrito de compras //
function vaciarTodo(e){
    e.preventDefault();
    // Realizamos un ciclo WHILE para comprobar si existen elementos en el carrito de compras //
    while(listaCarrito.firstChild){
        listaCarrito.removeChild(listaCarrito.firstChild);
    }

    // Llamamos la función para eliminar todos los cursos del localStorage //
    vaciarTodoLS();

    // Llamamos la función para obtener todos los datos almacenados en el localStorage //
    cursoLS = obtenerLocalStorage();

    // Llamamos la función para actualizar el numero de datos que fueron borrados //
    contadorLS(cursoLS);

    // Asignamos un campo vacío dentro del DIV de los botones //
    botones.innerHTML = '';

    // Detenemos la ejecución de la función //
    return false;
}

// Función para guardar los datos del curso seléccionado //
function guardarLocalStorage(curso){
    // Creámos una variable indefinida //
    let cursos;

    // Le asignamos a la variable la función para llamar los datos almacenados en el localStorage //
    cursos = obtenerLocalStorage();

    // Pusheamos la variable al curso seléccionado para almacenarlo dentro del localStorage //
    cursos.push(curso);

    // Guardamos el curso seléccionado dentro del localStorage como un STRING //
    localStorage.setItem('cursos', JSON.stringify(cursos));

    // Llamamos la función para actualizar el numero de datos guardados en el localStorage //
    contadorLS(cursos);
}

// Función para llamar los datos almacenados dentro del localStorage //
function obtenerLocalStorage(){

    // Creámos una variable indefinida //
    let cursosLS;

    /* Realizamos una condicional para verificar si el campo del localStorage esta vacío, lo empiece
    como un arreglo vacío, y si no lo esta vamos a tomar el dato almacenado */
    if(localStorage.getItem('cursos') === null){
        cursosLS = [];
    }else{
        cursosLS = JSON.parse(localStorage.getItem('cursos'));
    }

    // Retornamos la variable si encuentra datos almacenados //
    return cursosLS;
}

/* Función para leer los datos almacenados en el localStorage y imprimirlos en la pantalla con 
template literals */
function leerLS(){
    // Asignamos una variable indefinida //
    let cursosLS;

    // Le asignamos a la variable la función para llamar los datos almacenados en el localStorage //
    cursosLS = obtenerLocalStorage();

    // Llamamos la función para actualizar el numero de datos almacenados actuálmente en el localStorage //
    contadorLS(cursosLS);

    // Realizamos un ciclo FOREACH para imprimir cada dato almacenado dentro del localStorage //
    cursosLS.forEach(function(curso){
        // Creámos una variable con el valor de un elemento (tr) para enlazarlo a la tabla del carrito de compras //
        const row = document.createElement('tr');

        // Obtenemos el ID del DIV botones para imprimirlos en el carrito de compras //
        const botones = document.getElementById('botones');

        // Imprimimos los datos del localStorage con template literals, utilizando la variable row //
        row.innerHTML = `
    

        <td><img src="${curso.img}" width="100"></td>
        <td>${curso.titulo}</td>
        <td>${curso.precio}</td>
        <td>
            <a href="#" class="borrar-curso" data-id="${curso.id}">
        X</a>
        </td>

        `

        // Le asignamos los botones que serán imprimidos si hay cursos dentro del carrito de compras //
        botones.innerHTML = `
    
        <a class="btn btn-success" href="">Pagar cursos</a>
        <a class="btn btn-secondary" href="">Seguir comprando</a>

        `   
        // Concatenamos dentro de la tabla la variable row creada para imprimir los datos //
        listaCarrito.appendChild(row);

    })

}

// Función para borrar los datos del localStorage //
function borrarLocalStorage(curso){
    // Creámos una variable indefinida //
    let cursosLS;

    // Le asignamos a la variable la función para llamar los datos almacenados en el localStorage //
    cursosLS = obtenerLocalStorage();

    /* Realizamos una comparación con el ID del elemento guardado y el ID del elemento 
    seléccionado, en caso que sean iguales lo borrará */
    cursosLS.forEach(function(element, index){
        if(element.id === curso){
            cursosLS.splice(index, 1);
        }
    })

    // Actualizamos los datos del localStorage para decirle que ya no existe el elemento borrado //
    localStorage.setItem('cursos', JSON.stringify(cursosLS));

    // Llamamos la función para actualizar el numero de datos borrados actuálmente en el localStorage //
    contadorLS(cursosLS);
}

// Función para borrar todos los datos del localStorage y almacenados dentro del carrito de compras //
function vaciarTodoLS(){
    localStorage.clear();
}

// Función para realizar la comprobación de cuantos datos hay actuálmente almacenados dentro del localStorage //
function contadorLS(curso){
    curso = obtenerLocalStorage();
    contador.innerHTML = `<span class="badge">${Object.keys(curso).length}</span>`;
}
// --------------------------- //