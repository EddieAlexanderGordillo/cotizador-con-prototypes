// Constructor
function Seguro(marca, year, tipo) {
  this.marca = marca;
  this.year = year;
  this.tipo = tipo;
}
//realiza la cotizacion con los datos
Seguro.prototype.cotizarSeguro = function () {
  let cantidad;
  const base = 400000;

  switch (this.marca) {
    case '1':
      cantidad = base * 1.15;
      break;
    case '2':
      cantidad = base * 1.05;
      break;
    case '3':
      cantidad = base * 1.35;
      break;

    default:
      break;
  }
  //leer el año
  const diferencia = new Date().getFullYear() - this.year;
  // cada año que la diferencia es mayor, el costo va a areducir un 3%
  cantidad -= (diferencia * 3 * cantidad) / 100;
  //si el seguro es basico se multiplica por un 30% mas y si es completo por un 50% mas
  if (this.tipo === 'basico') {
    cantidad *= 1.3;
  } else {
    cantidad *= 1.5;
  }
  return cantidad;
};
// constructor de la ui
function UI() {}
//llena las opciones de lso años
UI.prototype.llenarOpciones = () => {
  const max = new Date().getFullYear(),
    min = max - 20;
  const selectYear = document.querySelector('#year');
  for (let i = max; i > min; i--) {
    let option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    selectYear.appendChild(option);
  }
};
//muestra alertas en pantalla
UI.prototype.mostrarMensaje = (mensaje, tipo) => {
  const div = document.createElement('div');
  if (tipo === 'error') {
    div.classList.add('mensaje', 'error');
  } else {
    div.classList.add('mensaje', 'correcto');
  }
  div.classList.add('mensaje');
  div.textContent = mensaje;

  //insetar en el html
  const formulario = document.querySelector('#cotizar-seguro');
  formulario.insertBefore(div, document.querySelector('#resultado'));

  setTimeout(() => {
    div.remove();
  }, 3000);
};

UI.prototype.mostrarResultado = (total, seguro) => {
  const { marca, year, tipo } = seguro;
  let textoMarca;
  switch (marca) {
    case '1':
      textoMarca = 'Americano';
      break;
    case '2':
      textoMarca = 'Asiatico';
      break;
    case '3':
      textoMarca = 'Europeo';
      break;

    default:
      break;
  }
  //crear el resultado
  const div = document.createElement('div');
  div.classList.add('resultado__container');

  div.innerHTML = `
    <p class="header"> Tu Resumen</>
    <p>Marca: <span class="textSpan">${textoMarca}</span></p>
    <p> Año: <span class="textSpan">${year}</span></p>
    <p> Tipo: <span class="textSpan">${tipo}</span></p>
    <p> Total: <span class="textSpan">$ ${total}</span></p>
    `;
  const resultadoDiv = document.querySelector('#resultado');
  //mostrar el spiner
  const spinner = document.querySelector('#cargando');
  spinner.style.display = 'block';
  setTimeout(() => {
    spinner.style.display = 'none'; // se borra el spineer pero se muestra el resultado
    resultadoDiv.appendChild(div);
  }, 3000);
};
// instanciar ui
const ui = new UI();

document.addEventListener('DOMContentLoaded', () => {
  ui.llenarOpciones(); //llena el select con los años
});

eventListeners();
function eventListeners() {
  const formulario = document.querySelector('#cotizar-seguro');
  formulario.addEventListener('submit', cotizarSeguro);
}

function cotizarSeguro(e) {
  e.preventDefault();
  // leer la marca selecionada
  const marca = document.querySelector('#marca').value;
  //leer el año
  const year = document.querySelector('#year').value;

  // leer el tipo
  const tipo = document.querySelector('input[name="tipo"]:checked').value;

  if (marca === '' || year === '' || tipo === '') {
    ui.mostrarMensaje('Todos los campos son obligatorios', 'error');
    return;
  }
  e;
  ui.mostrarMensaje('Cotizando...', 'exito');
  //ocultar las cotizaciones previas
  const resultados = document.querySelector('#resultado div');
  if (resultados != null) {
    resultados.remove();
  }

  //utilizar el seguro
  const seguro = new Seguro(marca, year, tipo);
  const total = seguro.cotizarSeguro();
  //utilizar el prototype que va a cotizar
  ui.mostrarResultado(total, seguro);
}
