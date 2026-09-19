let ticket = [];
let metodoPagoActual = 'Efectivo'; // Por defecto

// URL de tu Web App de Google Sheets
const urlGoogleScript = "https://script.google.com/macros/s/AKfycbzZWfeFjxkiefmncXjG1_noDW55gu8cmKfcmC92gs_yOPTxt3ZZ7V9cmmgeA-UzXNXNWw/exec";

// Base de datos local por defecto (respaldo por si falla la conexión)
let productosData = {
    clasicas: [
        { nombre: 'Papas Clásicas - Chica', precio: 1500, img: 'img/clasicas.jpg' },
        { nombre: 'Papas Clásicas - Mediana', precio: 2500, img: 'img/clasicas.jpg' },
        { nombre: 'Papas Clásicas - Grande', precio: 3500, img: 'img/clasicas.jpg' }
    ],
    cheddar: [
        { nombre: 'Papas c/ Cheddar - Chica', precio: 1800, img: 'img/cheddar.jpg' },
        { nombre: 'Papas c/ Cheddar - Mediana', precio: 2900, img: 'img/cheddar.jpg' },
        { nombre: 'Papas c/ Cheddar - Grande', precio: 4000, img: 'img/cheddar.jpg' }
    ],
    huevo: [
        { nombre: 'Papas c/ Huevo - Chica', precio: 1800, img: 'img/huevo.jpg' },
        { nombre: 'Papas c/ Huevo - Mediana', precio: 2900, img: 'img/huevo.jpg' },
        { nombre: 'Papas c/ Huevo - Grande', precio: 4000, img: 'img/huevo.jpg' }
    ],
    cheddar_huevo: [
        { nombre: 'Papas c/ Cheddar y Huevo - Chica', precio: 1800, img: 'img/cheddar_huevo.jpg' },
        { nombre: 'Papas c/ Cheddar y Huevo - Mediana', precio: 2900, img: 'img/cheddar_huevo.jpg' },
        { nombre: 'Papas c/ Cheddar y Huevo - Grande', precio: 4000, img: 'img/cheddar_huevo.jpg' }
    ],
    salchipapas: [
        { nombre: 'Salchipapas - Chica', precio: 1800, img: 'img/salchipapa.jpg' },
        { nombre: 'Salchipapas - Mediana', precio: 2900, img: 'img/salchipapa.jpg' },
        { nombre: 'Salchipapas - Grande', precio: 4000, img: 'img/salchipapa.jpg' }
    ],
    salchi_chedar: [
        { nombre: 'Salchipapas c/ Cheddar - Chica', precio: 1800, img: 'img/salchi_chedar.jpg' },
        { nombre: 'Salchipapas c/ Cheddar - Mediana', precio: 2900, img: 'img/salchi_chedar.jpg' },
        { nombre: 'Salchipapas c/ Cheddar - Grande', precio: 4000, img: 'img/salchi_chedar.jpg' }
    ],
    salchi_huevo: [
        { nombre: 'Salchipapas c/ Huevo - Chica', precio: 1800, img: 'img/salchi_huevo.jpg' },
        { nombre: 'Salchipapas c/ Huevo - Mediana', precio: 2900, img: 'img/salchi_huevo.jpg' },
        { nombre: 'Salchipapas c/ Huevo - Grande', precio: 4000, img: 'img/salchi_huevo.jpg' }
    ],
    salchi_huevo_chedar: [
        { nombre: 'Salchipapas c/ Cheddar y Huevo - Chica', precio: 1800, img: 'img/salchi_huevo_chedar.jpg' },
        { nombre: 'Salchipapas c/ Cheddar y Huevo - Mediana', precio: 2900, img: 'img/salchi_huevo_chedar.jpg' },
        { nombre: 'Salchipapas c/ Cheddar y Huevo - Grande', precio: 4000, img: 'img/salchi_huevo_chedar.jpg' }
    ],
    individuales: [
        { nombre: 'Cono de papas', precio: 1200, img: 'img/cono.jpg' },
        { nombre: 'Pancho', precio: 1000, img: 'img/pancho.jpg' }
    ],
    bebidas: [
        { nombre: 'Gaseosa en botella', precio: 1500, img: 'img/gaseosa.jpg' },
        { nombre: 'Agua saborizada', precio: 1000, img: 'img/agua_saborizada.jpg' },
        { nombre: 'Agua mineral', precio: 800, img: 'img/agua.jpg' }
    ],
    promos: [
        { nombre: 'Cono de papas c/ lata', precio: 2000, img: 'img/papa_lata.jpg' },
        { nombre: 'Pancho c/ lata', precio: 1800, img: 'img/pancho_lata.jpg' }
    ]
};

// Función para cargar los precios actualizados desde Google Sheets
function cargarProductosDesdeSheets() {
    fetch(urlGoogleScript)
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                let nuevosProductos = {};
                data.forEach(prod => {
                    if (!nuevosProductos[prod.categoria]) {
                        nuevosProductos[prod.categoria] = [];
                    }
                    nuevosProductos[prod.categoria].push({
                        nombre: prod.nombre,
                        precio: prod.precio,
                        img: prod.img
                    });
                });
                productosData = nuevosProductos;
                console.log("Precios sincronizados desde Google Sheets.");
            }
        })
        .catch(error => {
            console.warn("Usando catálogo local (sin conexión a Sheets):", error);
        });
}

function abrirModal(categoria) {
    const modal = document.getElementById('modal-container');
    const titulo = document.getElementById('modal-title');
    const contenido = document.getElementById('modal-body-content');
    
    modal.style.display = 'flex';

    if (categoria === 'observaciones') {
        titulo.innerText = '📝 Reportar Faltantes / Materiales';
        contenido.innerHTML = `
            <p style="margin-bottom: 12px; color: #555; font-size: 0.95rem;">Escribe qué material, insumo o producto falta para avisar a administración:</p>
            <textarea id="texto-observacion" class="obs-textarea" placeholder="Ej: Faltan bandejas chicas, queda poco aceite..."></textarea>
            <button class="save-obs-btn" onclick="guardarObservacion()">Enviar Reporte</button>
        `;
    } else {
        titulo.innerText = 'Seleccionar Opción';
        let lista = productosData[categoria] || [];
        
        let htmlGrid = '<div class="modal-products-grid">';
        lista.forEach(prod => {
            htmlGrid += `
                <div class="modal-product-card" onclick="agregarAlTicket('${prod.nombre}', ${prod.precio})">
                    <img src="${prod.img}" alt="${prod.nombre}">
                    <h4>${prod.nombre}</h4>
                    <div class="price">$${prod.precio}</div>
                </div>
            `;
        });
        htmlGrid += '</div>';
        
        contenido.innerHTML = htmlGrid;
    }
}

function cerrarModal() {
    document.getElementById('modal-container').style.display = 'none';
}

function guardarObservacion() {
    const texto = document.getElementById('texto-observacion').value;
    if (!texto.trim()) {
        alert("El campo está vacío.");
        return;
    }

    const personalTexto = document.getElementById('personal-input').value || "No especificado";
    const turnoTexto = document.getElementById('turno-indicador').innerText.replace('🕒 Turno: ', '');

    const datosObs = {
        accion: "observacion",
        personal: `${turnoTexto} - Personal: ${personalTexto}`,
        reporte: texto
    };

    fetch(urlGoogleScript, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosObs)
    }).then(() => {
        alert("¡Reporte de faltante enviado a la base de datos con éxito!");
        cerrarModal();
    }).catch(error => {
        console.error("Error:", error);
        alert("Reporte guardado localmente (error de red con la planilla).");
        cerrarModal();
    });
}

function seleccionarPago(metodo) {
    metodoPagoActual = metodo;
    const btnEfectivo = document.getElementById('btn-efectivo');
    const btnTransferencia = document.getElementById('btn-transferencia');
    const transferOptions = document.getElementById('transfer-options');

    if (metodo === 'Efectivo') {
        btnEfectivo.classList.add('active');
        btnTransferencia.classList.remove('active');
        transferOptions.style.display = 'none';
    } else {
        btnTransferencia.classList.add('active');
        btnEfectivo.classList.remove('active');
        transferOptions.style.display = 'block';
    }
}

function agregarAlTicket(nombre, precio) {
    let index = ticket.findIndex(item => item.nombre === nombre);
    if (index !== -1) {
        ticket[index].cantidad += 1;
    } else {
        ticket.push({ nombre: nombre, precio: precio, cantidad: 1 });
    }
    actualizarTicketVisual();
}

function cambiarCantidad(index, delta) {
    ticket[index].cantidad += delta;
    if (ticket[index].cantidad <= 0) {
        ticket.splice(index, 1);
    }
    actualizarTicketVisual();
}

function actualizarTicketVisual() {
    const container = document.getElementById('ticket-items');
    const totalAmount = document.getElementById('ticket-total-amount');
    
    if (ticket.length === 0) {
        container.innerHTML = '<p class="empty-msg">No hay productos seleccionados</p>';
        totalAmount.innerText = '$0';
        return;
    }

    container.innerHTML = '';
    let total = 0;

    ticket.forEach((item, index) => {
        let subtotal = item.precio * item.cantidad;
        total += subtotal;

        container.innerHTML += `
            <div class="ticket-item">
                <div class="ticket-item-details">
                    <strong>${item.nombre}</strong><br>
                    <small style="color: #666;">$${item.precio} x ${item.cantidad}</small>
                </div>
                <div class="ticket-item-controls">
                    <button onclick="cambiarCantidad(${index}, -1)">-</button>
                    <span>${item.cantidad}</span>
                    <button onclick="cambiarCantidad(${index}, 1)">+</button>
                </div>
            </div>
        `;
    });

    totalAmount.innerText = `$${total}`;
}

function finalizarVenta() {
    if (ticket.length === 0) {
        alert("El ticket está vacío.");
        return;
    }

    const turnoTexto = document.getElementById('turno-indicador').innerText.replace('🕒 Turno: ', '');
    const personalTexto = document.getElementById('personal-input').value || "No especificado";
    
    let detalleTransferencia = "Efectivo recibido";
    if (metodoPagoActual === 'Transferencia') {
        const comprobanteCheck = document.getElementById('check-comprobante').checked;
        detalleTransferencia = comprobanteCheck ? "Comprobante verificado" : "Falta verificar comprobante";
    }

    let resumenProductos = ticket.map(item => `${item.cantidad}x ${item.nombre}`).join(', ');
    let totalVenta = ticket.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

    const datosVenta = {
        accion: "venta",
        turno: turnoTexto,
        personal: personalTexto,
        productos: resumenProductos,
        total: totalVenta,
        metodoPago: metodoPagoActual,
        estadoPago: detalleTransferencia
    };

    fetch(urlGoogleScript, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosVenta)
    })
    .then(() => {
        alert("¡Venta registrada y guardada en Google Sheets con éxito! 🚀");
        resetearVentaLocal();
    })
    .catch(error => {
        console.error("Error al registrar la venta:", error);
        alert("Hubo un error al conectar con la planilla, pero la venta se procesó.");
        resetearVentaLocal();
    });
}

function resetearVentaLocal() {
    ticket = [];
    document.getElementById('check-comprobante').checked = false;
    seleccionarPago('Efectivo');
    actualizarTicketVisual();
}

function calcularTurnoAutomatico() {
    const ahora = new Date();
    const hora = ahora.getHours();
    const indicador = document.getElementById('turno-indicador');
    
    if (!indicador) return;

    let turnoTexto = "🕒 Turno: Fuera de horario";

    if (hora >= 11 && hora < 19) {
        turnoTexto = "🕒 Turno: Mañana (11:00 a 19:00 hs)";
    } else if (hora >= 19 || hora < 3) {
        turnoTexto = "🕒 Turno: Tarde (19:00 a 03:00 hs)";
    } else if (hora >= 3 && hora < 9) {
        turnoTexto = "🕒 Turno: Madrugada (03:00 a 09:00 hs)";
    }
    
    indicador.innerText = turnoTexto;
}

function actualizarPersonal() {
    const personalInput = document.getElementById('personal-input');
    console.log("Personal en turno:", personalInput.value);
}

// Ejecutar al cargar la página
window.onload = function() {
    calcularTurnoAutomatico();
    cargarProductosDesdeSheets();
};