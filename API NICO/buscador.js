// Cargar datos desde localStorage
let ligas = JSON.parse(localStorage.getItem('ligas')) || [];
let equipos = JSON.parse(localStorage.getItem('equipos')) || [];
let jugadores = JSON.parse(localStorage.getItem('jugadores')) || [];

// Referencias
const buscador = document.getElementById('buscador');
const resultados = document.getElementById('resultados');

// Render inicial vacío
renderResultados('');

// Render en vivo
buscador.addEventListener('input', e => {
    renderResultados(e.target.value.trim());
});

function renderResultados(filtro) {
    let html = '';
    // Buscar en ligas
    let ligasFiltradas = ligas.filter(liga => liga.toLowerCase().includes(filtro.toLowerCase()));
    if (ligasFiltradas.length > 0) {
        html += `<h3>Ligas</h3><ul>`;
        ligasFiltradas.forEach(liga => {
            html += `<li><b>${liga}</b></li>`;
        });
        html += `</ul>`;
    }
    // Buscar en equipos
    let equiposFiltrados = equipos.filter(eq => eq.nombre.toLowerCase().includes(filtro.toLowerCase()) || eq.liga.toLowerCase().includes(filtro.toLowerCase()));
    if (equiposFiltrados.length > 0) {
        html += `<h3>Equipos</h3><ul>`;
        equiposFiltrados.forEach(eq => {
            html += `<li><b>${eq.nombre}</b> <span>(${eq.liga})</span></li>`;
        });
        html += `</ul>`;
    }
    // Buscar en jugadores
    let jugadoresFiltrados = jugadores.filter(j =>
        j.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
        j.equipo.toLowerCase().includes(filtro.toLowerCase()) ||
        j.posicion.toLowerCase().includes(filtro.toLowerCase())
    );
    if (jugadoresFiltrados.length > 0) {
        html += `<h3>Jugadores</h3><ul>`;
        jugadoresFiltrados.forEach(j => {
            html += `<li><b>${j.nombre}</b> - ${j.posicion} <span>(${j.equipo})</span></li>`;
        });
        html += `</ul>`;
    }
    if (!html) html = '<p style="color:#888;">Sin resultados.</p>';
    resultados.innerHTML = html;
}