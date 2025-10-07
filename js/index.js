// clientes.js

const form = document.getElementById('clienteForm');
const tableBody = document.querySelector('#clientesTable tbody');

async function fetchClientes() {
  const res = await fetch('/clientes'); // Ajuste a rota conforme seu backend
  const clientes = await res.json();
  tableBody.innerHTML = '';
  clientes.forEach(cliente => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td data-label="Nome">${cliente.nome}</td>
      <td data-label="Email">${cliente.email}</td>
      <td data-label="Ações">
        <button onclick="editarCliente(${cliente.id})">Editar</button>
        <button onclick="excluirCliente(${cliente.id})">Excluir</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;

  await fetch('/clientes/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email })
  });

  form.reset();
  fetchClientes();
});

async function excluirCliente(id) {
  await fetch(`/clientes/${id}`, { method: 'DELETE' });
  fetchClientes();
}

function editarCliente(id) {
  // Aqui você pode implementar a lógica para editar (ex: abrir modal ou preencher o formulário)
  alert('Função editar ainda não implementada');
}

// Inicializa a lista ao carregar a página
fetchClientes();