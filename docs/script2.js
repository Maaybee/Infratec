// --- CONFIGURAÇÃO DO SUPABASE ---
const SUPABASE_URL = "https://rlotdgfshvdtfkrlztlz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsb3RkZ2ZzaHZkdGZrcmx6dGx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNDIzOTIsImV4cCI6MjA3NDgxODM5Mn0.qvbNsmkz8FC-f4k5JYYW9Qh7ERs_kPnarPUu5O82yTg";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


// --- 1. DATA AUTOMÁTICA AO CARREGAR ---
document.addEventListener('DOMContentLoaded', () => {
  const campoData = document.getElementById('data');
  // Se o campo existir, define o valor como a data de hoje (YYYY-MM-DD)
  if (campoData) {
    const hoje = new Date().toISOString().split('T')[0];
    campoData.value = hoje;
  }
});


// --- 2. MÁSCARA DE MOEDA (R$) ---
const inputValor = document.getElementById('campo-valor');

inputValor.addEventListener('input', function(evento) {
  let valor = evento.target.value;
  // Remove tudo que não for dígito
  let valorLimpo = valor.replace(/\D/g, '');
  // Divide por 100 para ter os centavos
  let valorNumerico = Number(valorLimpo) / 100;

  // Formata para o padrão brasileiro
  let valorFormatado = valorNumerico.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

  evento.target.value = valorFormatado;
});


// --- 3. FUNÇÃO DE ENVIO ---
const btnEnviar = document.getElementById('btn-enviar');
btnEnviar.addEventListener('click', enviar);

async function enviar() { 
  // Pega os valores dos campos
  const inputData = document.getElementById('data').value;
  const selectTipo = document.getElementById('select-tipo').value;
  const selectCategoria = document.getElementById('select-categoria').value;
  const inputDesc = document.getElementById('desc').value;
  const valorFormatado = document.getElementById('campo-valor').value;
   
  // Pega o ID do usuário logado (armazenado no localStorage)
  const usuario = localStorage.getItem('id'); 

  // Validação simples
  if (!inputData || !selectTipo || !selectCategoria || !valorFormatado || !usuario) {
    alert('Por favor, preencha todos os campos obrigatórios e verifique se está logado.');
    return;
  }

  // Limpa a formatação de moeda para salvar no banco (R$ 1.000,00 -> 1000.00)
  let valorLimpo = valorFormatado.replace('R$', '').trim(); 
  valorLimpo = valorLimpo.replace(/\./g, '');            
  valorLimpo = valorLimpo.replace(',', '.');               
  const valorNumerico = parseFloat(valorLimpo);              

  if (isNaN(valorNumerico)) {
    alert('O valor inserido não é válido.');
    return;
  }
  
  const NOME_DA_TABELA = 'caixa';

  // Objeto preparado para o Supabase
  // IMPORTANTE: As chaves respeitam as maiúsculas/minúsculas da sua tabela
  const dadosParaInserir = {
    data: inputData,            // Coluna 'data'
    Tipo: selectTipo,           // Coluna 'Tipo'
    Categoria: selectCategoria, // Coluna 'Categoria'
    Descricao: inputDesc,       // Coluna 'Descricao'
    Valor: valorNumerico,       // Coluna 'Valor'
    id_user: usuario            // Coluna 'id_user' (Chave Estrangeira correta)
  };

  try {
    const { data, error } = await supabaseClient
      .from(NOME_DA_TABELA)
      .insert([ dadosParaInserir ]); 

    if (error) {
      throw error;
    }

    alert('Dados salvos com sucesso!');

    // Limpa os campos visuais
    document.getElementById('select-tipo').value = '';
    document.getElementById('select-categoria').value = '';
    document.getElementById('desc').value = '';
    document.getElementById('campo-valor').value = '';
    
    // Reseta a data para hoje (para facilitar novo lançamento rápido)
    document.getElementById('data').value = new Date().toISOString().split('T')[0];

  } catch (error) {
    console.error('Erro ao inserir dados:', error.message);
    alert('Ocorreu um erro ao salvar: ' + error.message);
  }
}
