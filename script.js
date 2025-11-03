const SUPABASE_URL = "https://rlotdgfshvdtfkrlztlz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsb3RkZ2ZzaHZkdGZrcmx6dGx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNDIzOTIsImV4cCI6MjA3NDgxODM5Mn0.qvbNsmkz8FC-f4k5JYYW9Qh7ERs_kPnarPUu5O82yTg";

// 1. Cliente Supabase
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


// 2. O bloco de código "inputValor" foi REMOVIDO.
//    Ele estava causando um erro e parando o script,
//    pois 'campo-valor' não existe no seu HTML de login.


// 3. Esta é a ÚNICA função 'entrar'
async function entrar() {
    // Pega o valor do input correto
    const inputElement = document.getElementById('input-nome');
    const nomeUsuario = inputElement.value; 

    if (!nomeUsuario) {
        alert('Por favor, digite o nome do usuário.');
        return;
    }

    const NOME_DA_TABELA = 'usuarios';
    
    // CORREÇÃO: O nome da coluna é 'user' (sem aspas dentro da string)
    const COLUNA_DO_NOME = 'user';

    try {
        // 4. Executa a consulta
        const { data, error } = await supabaseClient
            .from(NOME_DA_TABELA)
            .select(COLUNA_DO_NOME)
            // MELHORIA: .ilike() ignora maiúsculas/minúsculas ("Ju" ou "ju")
            .ilike(COLUNA_DO_NOME, nomeUsuario); 

        if (error) {
            throw error;
        }

        // 5. Verifica o resultado
        if (data && data.length > 0) {
            // SUCESSO!
            alert('Acesso liberado! Bem-vindo, ' + nomeUsuario + '.');
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
