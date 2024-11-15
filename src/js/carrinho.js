var localCarrinho = localStorage.getItem('carrinho');

if (localCarrinho) {
    var carrinho = JSON.parse(localCarrinho);
    if (carrinho.length > 0) {
        //TEM ITENS NO CARRINHO
        //RENDERIZAR  O CARRINHO
        renderizarCarrinho();
        //SOMAR TOTAIS DOS PRODUTOS
        calcularTotal();
    } else {
        //MOSTRAR CARRINHO VAZIO
        carrinhoVazio();
    }
} else {
    // MOSTRAR CARRINHO VAZIO
    carrinhoVazio();
}

function renderizarCarrinho() {
    //LiMPAR AREA DOS ITENS
    $("#listaCarrinho").empty();

    //PERCORRER O CARRINHO E ALIMENTAR A áREA
    $.each(carrinho, function (index, itemCarrinho) {
        var itemDiv = `
        <!-- ITEM DO CARRINHO -->
<div class="item-carrinho" data-index="${index}">
    <div class="area-img">
        <img src="${itemCarrinho.item.imagem}" alt="">
    </div>
    <div class="area-details">
        <div class="sup">
            <span class="name-prod">
            ${itemCarrinho.item.nome}
            </span>
            <a data-index="${index}" class="delete-item" href="#">
                <i class="mdi mdi-close"></i>
            </a>
        </div>
        <div class="middle">
            <span>${itemCarrinho.item.principal_caracteristica}</span>
        </div>
        <div class="preco-quantidade">
            <span>${itemCarrinho.item.preco_promocional.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            <div class="count">
                <a class="minus" data-index="${index}" href="#">-</a>
                <input class="qtd-item" type="text" value="${itemCarrinho.quantidade}" readonly>
                <a class="plus" data-index="${index}" href="#">+</a>
            </div>
        </div>
    </div>
</div>
`;

        $("#listaCarrinho").append(itemDiv);
    });

    $(".delete-item").on('click', function () {
        var index = $(this).data('index');
        //CONFIRMAR
        app.dialog.confirm('Tem certeza que quer remover esse item?', 'Remover Item', function () {

            //REMOVER O ITEM DO CARRINHO
            carrinho.splice(index, 1);
            //ATUALIZAR O CARINHO APÓS REMOVER O ITEM
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            //ATUALIZAR A PÁGINA
            app.views.main.router.refreshPage();
        });

    });

    $(".minus").on('click', function () {
        var index = $(this).data('index');

        //SE TIVER MAIS DE UM ITEM NA QUANTIDADE
        if (carrinho[index].quantidade > 1) {
            carrinho[index].quantidade--;
            carrinho[index].total_item = carrinho[index].quantidade * carrinho[index].item.preco_promocional;
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            renderizarCarrinho();
            calcularTotal();
        } else {
            var itemname = carrinho[index].item.nome;
            app.dialog.confirm(`Gostariar de remover <strong>${itemname}</strong>?`, 'Remover Item', function () {
                carrinho.splice(index, 1);
                localStorage.setItem('carrinho', JSON.stringify(carrinho));
                renderizarCarrinho();
                calcularTotal();
            });
        }

    });

    $(".plus").on('click', function () {
        var index = $(this).data('index');

        carrinho[index].quantidade++;
        carrinho[index].total_item = carrinho[index].quantidade * carrinho[index].item.preco_promocional;
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        renderizarCarrinho();
        calcularTotal();

    });

}

function calcularTotal() {
    var totalCarrinho = 0;
    $.each(carrinho, function (index, itemCarrinho) {
        totalCarrinho += itemCarrinho.total_item;
    });
    //MOSTRAR TOTAL
    $("#subtotal").html(totalCarrinho.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }))

}

function carrinhoVazio() {
    //ESVAZIAR LISTA DO CARRINHO
    $("#listaCarrinho").empty();

    //SUMIR OS ITENS DE BAIXO BOTÃO E TOTAIS
    $("#toolbarTotais").addClass('display-none')
    $("#toolbarCheckout").addClass('display-none')

    //MOSTRAR ANIMAÇÃO DE SACOLINHA VAZIA
    $("#listaCarrinho").html(`
    <div class="text-align-center tal">
                    <img class="align-items-center margin-right empty" src="src/img/empty.gif" 
                    > </div><span class="color-gray nd">Nada por enquanto...</span>
                    </div>
`);

}

$("#esvaziar").on('click', function () {
    app.dialog.confirm('Tem certeza que quer esvaziar o carrinho?', '<strong>Esvaziar Carrinho</strong>', function () {
        //APAGAR O LOCALSTORAGE DO CARRINHO
        localStorage.removeItem('carrinho');
        app.views.main.router.refreshPage();
    });
});
