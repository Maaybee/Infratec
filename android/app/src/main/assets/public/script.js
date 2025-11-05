const SUPABASE_URL = "https://rlotdgfshvdtfkrlztlz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsb3RkZ2ZzaHZkdGZrcmx6dGx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNDIzOTIsImV4cCI6MjA3NDgxODM5Mn0.qvbNsmkz8FC-f4k5JYYW9Qh7ERs_kPnarPUu5O82yTg";

// 1. Cliente Supabase
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


// 2. FUNÇÃO DE LOGIN
// (Funções duplicadas e o código 'inputValor' foram removidos)

async function entrar() {
   // Pega o valor do input de nome
   const inputElement = document.getElementById('input-nome');
   const nomeUsuario = inputElement.value; 
    if (!nomeUsuario) {
        alert('Por favor, digite o nome do usuário.');
        return;
    }

    const NOME_DA_TABELA = 'usuarios';
    const COLUNA_DO_NOME = 'user';

    try {
        // 3. Executa a consulta
        // Pede o 'id' (numérico) e o 'user' (nome)
        const { data, error } = await supabaseClient
            .from(NOME_DA_TABELA)
            .select('id, user') // <-- Busca o ID numérico e o nome
            .ilike(COLUNA_DO_NOME, nomeUsuario); // Busca por "Ju" ou "ju"

        if (error) {
            throw error;
        }

        // 4. Verifica o resultado
        if (data && data.length > 0) {
            // SUCESSO!
            // data[0] agora será { id: 1, user: 'Ju' }
            alert('Acesso liberado! Bem-vindo, ' + nomeUsuario + '.');
            
            // 5. SALVA O ID NUMÉRICO (1) NO LOCALSTORAGE
            // Seu outro script (script2.js) vai ler esta chave 'id'
            localStorage.setItem('id', data[0].id); 

            location.href = "home.html"; // Redireciona

        } else {
            // FALHA NO LOGIN (RLS ou usuário não existe)
            alert('Acesso negado. Usuário não encontrado.');
            inputElement.value = '';
        }

    } catch (error) {
        console.error('Erro ao verificar usuário:', error.message);
        alert('Ocorreu um erro ao tentar entrar. Verifique o console.');
    }
}
