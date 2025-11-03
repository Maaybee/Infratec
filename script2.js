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

