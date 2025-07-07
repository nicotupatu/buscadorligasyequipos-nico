// --- DATOS ---
let ligas = JSON.parse(localStorage.getItem('ligas')) || [];
let equipos = JSON.parse(localStorage.getItem('equipos')) || [];
let jugadores = JSON.parse(localStorage.getItem('jugadores')) || [];

// --- FUNCIONES AUXILIARES ---
function guardarDatos() {
    localStorage.setItem('ligas', JSON.stringify(ligas));
    localStorage.setItem('equipos', JSON.stringify(equipos));
    localStorage.setItem('jugadores', JSON.stringify(jugadores));
}

function renderizarLigas() {
    const ul = document.getElementById('listaLigas');
    ul.innerHTML = '';
    ligas.forEach((liga, idx) => {
        const li = document.createElement('li');
        li.innerHTML = `<b>${liga}</b>
            <span class="acciones">
                <button onclick="editarLiga(${idx})">Editar</button>
                <button onclick="eliminarLiga(${idx})">Eliminar</button>
            </span>`;
        ul.appendChild(li);
    });
    // Actualizar select de equipos
    const select = document.getElementById('ligaEquipo');
    select.innerHTML = ligas.map(l => `<option value="${l}">${l}</option>`).join('');
}

function renderizarEquipos() {
    const ul = document.getElementById('listaEquipos');
    ul.innerHTML = '';
    equipos.forEach((eq, idx) => {
        const li = document.createElement('li');
        li.innerHTML = `<b>${eq.nombre}</b> (${eq.liga})
            <span class="acciones">
                <button onclick="editarEquipo(${idx})">Editar</button>
                <button onclick="eliminarEquipo(${idx})">Eliminar</button>
            </span>
            <ul class="jugadores-lista" id="jugadoresEquipo${idx}"></ul>
        `;
        ul.appendChild(li);
        renderizarJugadoresDeEquipo(eq.nombre, `jugadoresEquipo${idx}`);
    });
    // Actualizar select de jugadores
    const select = document.getElementById('equipoJugador');
    select.innerHTML = equipos.map(e => `<option value="${e.nombre}">${e.nombre}</option>`).join('');
}

function renderizarJugadoresDeEquipo(nombreEquipo, idUl) {
    const ul = document.getElementById(idUl);
    if (!ul) return;
    ul.innerHTML = '';
    let js = jugadores.filter(j => j.equipo === nombreEquipo);
    js.forEach((j, idx) => {
        const li = document.createElement('li');
        li.textContent = `${j.nombre} - ${j.posicion}`;
        li.innerHTML += ` <button onclick="eliminarJugadorPorEquipo('${nombreEquipo}',${idx})" style="font-size: 0.8em;">Eliminar</button>`;
        ul.appendChild(li);
    });
}

function renderizarJugadores() {
    const ul = document.getElementById('listaJugadores');
    ul.innerHTML = '';
    jugadores.forEach((j, idx) => {
        const li = document.createElement('li');
        li.innerHTML = `<b>${j.nombre}</b> - ${j.posicion} (${j.equipo})
            <span class="acciones">
                <button onclick="editarJugador(${idx})">Editar</button>
                <button onclick="eliminarJugador(${idx})">Eliminar</button>
            </span>`;
        ul.appendChild(li);
    });
}

// --- CRUD LIGAS ---
document.getElementById('formLiga').onsubmit = function(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombreLiga').value.trim();
    if (nombre && !ligas.includes(nombre)) {
        ligas.push(nombre);
        guardarDatos();
        renderizarLigas();
        renderizarEquipos();
        renderizarJugadores();
    }
    this.reset();
};

window.editarLiga = function(idx) {
    const nuevoNombre = prompt('Nuevo nombre de la liga:', ligas[idx]);
    if (nuevoNombre && !ligas.includes(nuevoNombre)) {
        // Actualizar equipos y jugadores que están en esa liga
        equipos.forEach(eq => { if (eq.liga === ligas[idx]) eq.liga = nuevoNombre; });
        ligas[idx] = nuevoNombre;
        guardarDatos();
        renderizarLigas();
        renderizarEquipos();
        renderizarJugadores();
    }
};

window.eliminarLiga = function(idx) {
    if (confirm('¿Eliminar la liga y sus equipos?')) {
        const ligaEliminada = ligas[idx];
        ligas.splice(idx, 1);
        let equiposEliminados = equipos.filter(eq => eq.liga === ligaEliminada).map(eq => eq.nombre);
        equipos = equipos.filter(eq => eq.liga !== ligaEliminada);
        jugadores = jugadores.filter(j => !equiposEliminados.includes(j.equipo));
        guardarDatos();
        renderizarLigas();
        renderizarEquipos();
        renderizarJugadores();
    }
};

// --- CRUD EQUIPOS ---
document.getElementById('formEquipo').onsubmit = function(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombreEquipo').value.trim();
    const liga = document.getElementById('ligaEquipo').value;
    if (nombre && liga && !equipos.find(eq => eq.nombre === nombre)) {
        equipos.push({ nombre, liga });
        guardarDatos();
        renderizarEquipos();
        renderizarJugadores();
    }
    this.reset();
};

window.editarEquipo = function(idx) {
    const nuevoNombre = prompt('Nuevo nombre del equipo:', equipos[idx].nombre);
    const nuevaLiga = prompt('Nueva liga:', equipos[idx].liga);
    if (nuevoNombre && nuevaLiga) {
        // Actualizar jugadores de ese equipo
        jugadores.forEach(j => { if (j.equipo === equipos[idx].nombre) j.equipo = nuevoNombre; });
        equipos[idx] = { nombre: nuevoNombre, liga: nuevaLiga };
        guardarDatos();
        renderizarEquipos();
        renderizarJugadores();
    }
};

window.eliminarEquipo = function(idx) {
    if (confirm('¿Eliminar este equipo y sus jugadores?')) {
        const equipoEliminado = equipos[idx].nombre;
        equipos.splice(idx, 1);
        jugadores = jugadores.filter(j => j.equipo !== equipoEliminado);
        guardarDatos();
        renderizarEquipos();
        renderizarJugadores();
    }
};

// --- CRUD JUGADORES ---
document.getElementById('formJugador').onsubmit = function(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombreJugador').value.trim();
    const posicion = document.getElementById('posicionJugador').value.trim();
    const equipo = document.getElementById('equipoJugador').value;
    if (nombre && posicion && equipo && !jugadores.find(j => j.nombre === nombre && j.equipo === equipo)) {
        jugadores.push({ nombre, posicion, equipo });
        guardarDatos();
        renderizarJugadores();
        renderizarEquipos();
    }
    this.reset();
};

window.editarJugador = function(idx) {
    const nuevoNombre = prompt('Nuevo nombre del jugador:', jugadores[idx].nombre);
    const nuevaPosicion = prompt('Nueva posición:', jugadores[idx].posicion);
    const nuevoEquipo = prompt('Nuevo equipo:', jugadores[idx].equipo);
    if (nuevoNombre && nuevaPosicion && nuevoEquipo) {
        jugadores[idx] = { nombre: nuevoNombre, posicion: nuevaPosicion, equipo: nuevoEquipo };
        guardarDatos();
        renderizarJugadores();
        renderizarEquipos();
    }
};

window.eliminarJugador = function(idx) {
    if (confirm('¿Eliminar este jugador?')) {
        jugadores.splice(idx, 1);
        guardarDatos();
        renderizarJugadores();
        renderizarEquipos();
    }
};

window.eliminarJugadorPorEquipo = function(nombreEquipo, idx) {
    // Obtén los jugadores de ese equipo
    let jugadoresEquipo = jugadores.filter(j => j.equipo === nombreEquipo);
    let jugador = jugadoresEquipo[idx];
    if (jugador && confirm('¿Eliminar este jugador?')) {
        // Buscar el índice global del jugador
        let idxGlobal = jugadores.findIndex(j => j.nombre === jugador.nombre && j.equipo === jugador.equipo);
        if (idxGlobal !== -1) {
            jugadores.splice(idxGlobal, 1);
            guardarDatos();
            renderizarJugadores();
            renderizarEquipos();
        }
    }
};

// --- INICIALIZAR ---
renderizarLigas();
renderizarEquipos();
renderizarJugadores();

// --- EXPORTAR DATOS ---
document.getElementById('exportarDatos').onclick = function() {
    const datos = { ligas, equipos, jugadores };
    const blob = new Blob([JSON.stringify(datos, null, 2)], {type : 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "datos_futbol.json";
    a.click();
    URL.revokeObjectURL(url);
};

// --- IMPORTAR DATOS ---
document.getElementById('importarDatos').onchange = function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
        try {
            const datos = JSON.parse(ev.target.result);
            ligas = datos.ligas || [];
            equipos = datos.equipos || [];
            jugadores = datos.jugadores || [];
            guardarDatos();
            renderizarLigas();
            renderizarEquipos();
            renderizarJugadores();
            alert("Datos importados correctamente");
        } catch {
            alert("Error al importar los datos");
        }
    };
    reader.readAsText(file);
};

// ... (resto de tu JS arriba) ...

function obtenerEscudo(nombreEquipo) {
    // Normaliza para buscar coincidencias sencillas
    let key = nombreEquipo.toLowerCase();
    if (key.includes('real madrid')) return 'img/realmadrid.svg';
    if (key.includes('psg') || key.includes('paris')) return 'img/psg.svg';
    if (key.includes('bayern')) return 'img/FC_Bayern_München.png';
    if (key.includes('manchester city') || key.includes('man city')) return 'img/Manchester_City_FC_badge.svg';
    if (key.includes('liverpool')) return 'img/liverpool.svg';
    if (key.includes('barcelona')) return 'img/barca.svg';
    return ''; // Sin escudo
}

function renderizarEquipos() {
    const ul = document.getElementById('listaEquipos');
    ul.innerHTML = '';
    equipos.forEach((eq, idx) => {
        const escudo = obtenerEscudo(eq.nombre);
        const li = document.createElement('li');
        li.className = 'equipo-card';
        li.innerHTML = `
            ${escudo ? `<img class="escudo" src="${escudo}" alt="Escudo ${eq.nombre}">` : ''}
            <b>${eq.nombre}</b> <span class="liga">(${eq.liga})</span>
            <span class="acciones">
                <button onclick="editarEquipo(${idx})">Editar</button>
                <button onclick="eliminarEquipo(${idx})">Eliminar</button>
            </span>
            <ul class="jugadores-lista" id="jugadoresEquipo${idx}"></ul>
        `;
        ul.appendChild(li);
        renderizarJugadoresDeEquipo(eq.nombre, `jugadoresEquipo${idx}`);
    });
    // Actualizar select de jugadores
    const select = document.getElementById('equipoJugador');
    select.innerHTML = equipos.map(e => `<option value="${e.nombre}">${e.nombre}</option>`).join('');
}