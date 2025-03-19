//RECUMPERAR O ID DETALHE NO LOCALSTORAGE
var id = parseInt(localStorage.getItem('detalhe'));

//PEGAR OS PRODUTOS DO LOCALSTORAGE
var produtos = JSON.parse(localStorage.getItem('produtos'));

var item = produtos.find(produto => produto.id === id);

if (item) {
    //TEM O ITEM
    //alimentar com os valores do item
    $("#imagem-detalhe").attr('src', item.imagem);
    $("#nome-detalhe").html(item.nome);
    $("#rating-detalhe").html(item.rating);
    $("#like-detalhe").html(item.likes);
    $("#reviews-detalhe").html(item.reviews + ' reviews');
    $("#descricao-detalhe").html(item.descricao);
    $("#preco-detalhe").html(item.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
    $("#precopromo-detalhe").html(item.preco_promocional.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));

    var tabelaDetalhe = $("#tabdetalhes");

    item.detalhes.forEach(detalhe => {
        var linha = `
        <tr>
            <td>${detalhe.caracteristica}</td>
            <td>${detalhe.detalhes}</td>
        </tr>
        `;

        tabelaDetalhe.append(linha);

    });

}

var carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

//  FUNÇÃO PARA ADD AO CARRINHO
function adicionarAoCarrinho(item, quantidade) {
    var itemNoCarrinho = carrinho.find(c=> c.item.id === item.id);

    if(itemNoCarrinho){
        //JA TEM ITEM NO CARRINHO
        //Adicionar a quantidade
        itemNoCarrinho.quantidade += quantidade;
        itemNoCarrinho.total_item = itemNoCarrinho.quantidade * item.preco_promocional;
    }else {
        carrinho.push({
            item: item, 
            quantidade: quantidade,
            total_item: quantidade * item.preco_promocional
        });
    }

    //ATUALIZAR O LOCALSTORAGE DE CARRINHO
    localStorage.setItem('carrinho', JSON.stringify(carrinho));

}

//CLICOU NO ADD CARRINHO
$(".add-cart").on('click', function(){
    //ADD AO CARRINHO
    adicionarAoCarrinho(item, 1);

    var toastCenter = app.toast.create({
        text: `${item.nome} adicionado ao carrinho`,
        position: 'center',
        closeTimeout: 2000,
      });

      toastCenter.open();
})