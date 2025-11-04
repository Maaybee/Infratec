const SUPABASE_URL = "https://rlotdgfshvdtfkrlztlz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsb3RkZ2ZzaHZkdGZrcmx6dGx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNDIzOTIsImV4cCI6MjA3NDgxODM5Mn0.qvbNsmkz8FC-f4k5JYYW9Qh7ERs_kPnarPUu5O82yTg";

// 1. Cliente Supabase
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


const inputValor = document.getElementById('campo-valor');



inputValor.addEventListener('input', function(evento) {

  let valor = evento.target.value;



  // 1. Limpa o valor: remove tudo que NÃO for dígito

  let valorLimpo = valor.replace(/\D/g, '');



  // 2. Converte para número (tratando como centavos)

  // Ex: '12345' -> 123.45

  let valorNumerico = Number(valorLimpo) / 100;



  // 3. Formata como moeda brasileira (BRL)

  let valorFormatado = valorNumerico.toLocaleString('pt-BR', {

    style: 'currency',

    currency: 'BRL'

  });



  // 4. Devolve o valor formatado para o campo

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
  
  // Pega o ID do usuário que salvamos no login
  const usuario = localStorage.getItem('id'); 

  // Validação simples
  if (!inputData || !selectTipo || !selectCategoria || !valorFormatado || !usuario) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  // 2. LIMPA O VALOR (MUITO IMPORTANTE)
  // Converte "R$ 123,45" de volta para o número 123.45
  let valorLimpo = valorFormatado.replace('R$', '').trim(); // Remove "R$" e espaços
  valorLimpo = valorLimpo.replace(/\./g, '');              // Remove o ponto de milhar (ex: 1.000)
  valorLimpo = valorLimpo.replace(',', '.');                // Troca a vírgula por ponto
  const valorNumerico = parseFloat(valorLimpo);             // Converte para número

  if (isNaN(valorNumerico)) {
    alert('O valor inserido não é válido.');
    return;
  }

  // 3. DEFINE A TABELA E OS DADOS PARA INSERIR
  const NOME_DA_TABELA = 'caixa';
  
  // Cria o objeto que será salvo. 
  // As chaves (ex: 'data') devem ser os NOMES EXATOS DAS COLUNAS no Supabase.
  const dadosParaInserir = {
    data: inputData,
    tipo: selectTipo,
    categoria: selectCategoria,
    descricao: inputDesc,
    valor: valorNumerico,
    id: usuario // Assumindo que a coluna do usuário na tabela 'caixa' se chama 'id'
  };

  try {
    // 4. EXECUTA A INSERÇÃO (.insert() em vez de .select())
    const { data, error } = await supabaseClient
      .from(NOME_DA_TABELA)
      .insert([ dadosParaInserir ]); // <--- COMANDO CORRETO

    if (error) {
      // Se houver um erro do Supabase (ex: RLS, coluna errada)
      throw error;
    }

    // 5. SUCESSO!
    alert('Dados salvos com sucesso!');
    
    // Opcional: Limpar os campos após salvar
    document.getElementById('data').value = '';
    document.getElementById('select-tipo').value = '';
    document.getElementById('select-categoria').value = '';
    document.getElementById('desc').value = '';
    document.getElementById('campo-valor').value = '';

  } catch (error) {
    // 6. TRATAMENTO DE ERRO CORRIGIDO
    console.error('Erro ao inserir dados:', error.message);
    alert('Ocorreu um erro ao salvar os dados. Verifique o console.');
  }
}



