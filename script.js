const campoValor = document.getElementById("valor");
const botaoCalcular = document.getElementById("confirmar-pagamento");
const resultado = document.getElementById("resultado");

function formatarMoeda(valor) {
  const valorArredondado = Number(valor) || 0;
  return `R$ ${valorArredondado.toFixed(2).replace(".", ",")}`;
}

function mostrarMensagem(tipo, titulo, mensagem) {
  if (!resultado) {
    return;
  }

  resultado.className = `resultado ${tipo}`;
  resultado.innerHTML = `
    <h3>${titulo}</h3>
    <p>${mensagem}</p>
  `;
  resultado.style.display = "block";
}

function calcular() {
  if (!campoValor || !resultado) {
    console.warn("Os elementos do parquímetro não foram encontrados.");
    return;
  }

  const valorDigitado = campoValor.value.trim();
  const valorValido = /^\d+([.,]\d{1,2})?$/.test(valorDigitado);

  if (!valorDigitado || !valorValido) {
    mostrarMensagem(
      "erro",
      "Valor inválido",
      "Informe um valor numérico maior que zero.",
    );
    return;
  }

  const valor = Number(valorDigitado.replace(",", "."));

  if (!Number.isFinite(valor) || valor <= 0) {
    mostrarMensagem(
      "erro",
      "Valor inválido",
      "Informe um valor numérico maior que zero.",
    );
    return;
  }

  if (valor < 1) {
    mostrarMensagem(
      "erro",
      "Valor insuficiente",
      `O valor mínimo para iniciar a permanência é <strong>${formatarMoeda(1)}</strong>.`,
    );
    return;
  }

  let tempo;
  let troco;

  if (valor < 1.75) {
    tempo = 30;
    troco = valor - 1;
  } else if (valor < 3) {
    tempo = 60;
    troco = valor - 1.75;
  } else {
    tempo = 120;
    troco = valor - 3;
  }

  troco = Math.max(0, troco);

  resultado.className = "resultado sucesso";
  resultado.innerHTML = `
    <h3>Pagamento confirmado</h3>
    <p><strong>Valor pago:</strong> ${formatarMoeda(valor)}</p>
    <p><strong>Tempo liberado:</strong> ${tempo} minutos</p>
    <p><strong>Troco:</strong> ${formatarMoeda(troco)}</p>
    <small>Obrigado por usar o sistema de estacionamento urbano.</small>
  `;
  resultado.style.display = "block";
}

function iniciar() {
  if (!campoValor || !botaoCalcular || !resultado) {
    console.warn("Os elementos do parquímetro não foram encontrados.");
    return;
  }

  botaoCalcular.addEventListener("click", calcular);

  campoValor.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") {
      evento.preventDefault();
      calcular();
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciar);
} else {
  iniciar();
}
