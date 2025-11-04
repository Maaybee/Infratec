const SUPABASE_URL = "https://rlotdgfshvdtfkrlztlz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsb3RkZ2ZzaHZkdGZrcmx6dGx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNDIzOTIsImV4cCI6MjA3NDgxODM5Mn0.qvbNsmkz8FC-f4k5JYYW9Qh7ERs_kPnarPUu5O82yTg";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


const inputValor = document.getElementById('campo-valor');



inputValor.addEventListener('input', function(evento) {

  let valor = evento.target.value;

  let valorLimpo = valor.replace(/\D/g, '');

  let valorNumerico = Number(valorLimpo) / 100;

  let valorFormatado = valorNumerico.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

  evento.target.value = valorFormatado;

});

const btnEnviar = document.getElementById('btn-enviar');
btnEnviar.addEventListener('click', enviar);

async function enviar() { 
  // 1. PEGA OS DADOS DOS CAMPOS
  const inputData = document.getElementById('data').value;
  const selectTipo = document.getElementById('select-tipo').value;
  const selectCategoria = document.getElementById('select-categoria').value;
  const inputDesc = document.getElementById('desc').value;
  const valorFormatado = document.getElementById('campo-valor').value;
  
  // Pega o ID do usuário 
  const usuario = localStorage.getItem('id'); 


  if (!inputData || !selectTipo || !selectCategoria || !valorFormatado || !usuario) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }


  let valorLimpo = valorFormatado.replace('R$', '').trim(); 
  valorLimpo = valorLimpo.replace(/\./g, '');            
  valorLimpo = valorLimpo.replace(',', '.');              
  const valorNumerico = parseFloat(valorLimpo);             

  if (isNaN(valorNumerico)) {
    alert('O valor inserido não é válido.');
    return;
  }
  const NOME_DA_TABELA = 'caixa';

  const dadosParaInserir = {
    data: inputData,
    tipo: selectTipo,
    categoria: selectCategoria,
    descricao: inputDesc,
    valor: valorNumerico,
    id: usuario 
  };

  try {

    const { data, error } = await supabaseClient
      .from(NOME_DA_TABELA)
      .insert([ dadosParaInserir ]); 

    if (error) {
      throw error;
    }


    alert('Dados salvos com sucesso!');

    document.getElementById('data').value = '';
    document.getElementById('select-tipo').value = '';
    document.getElementById('select-categoria').value = '';
    document.getElementById('desc').value = '';
    document.getElementById('campo-valor').value = '';

  } catch (error) {
    console.error('Erro ao inserir dados:', error.message);
    alert('Ocorreu um erro ao salvar os dados. Verifique o console.');
  }
}



