function enviar() {

    var $arrProduto = document.getElementsByClassName('toggles');
    var $arrCliente = document.getElementsByClassName('listNomes');
    var radio;
    if (document.getElementById("pagamen").value === 'Avista') {
        radio = "Sim";
    } else {
        radio = "Nao";
    }

    var venda = {'produtos': [], 'data': new Date(), 'pagamento': radio, 'preco': radio};

    for (const item of $arrCliente) {
        if ($(item).val() == $('#clientes .userId').val()) {
            venda.cliente = $(item).text();
        }
    }

    for (const item of $arrProduto) {
        if (item.checked) {
            var _linha = $(item).parents('tr');
            var _produto = {
                'id': _linha.find(".produtoId").text(),
                'qtd': _linha.find('.produtoQtd input').val(),
                'nom': _linha.find('.produtoNom').text(),
                'prc': _linha.find('.produtoPreco').text()
            };

            venda.produtos.push(_produto);
        }
    }

    $.ajax({
        url: './middle/middleVenda.php',
        data: { 'acao': 'cadastra', 'dados': JSON.stringify(venda)},
        method: "post",
        cache: "false"
    }).done(function (res) {
        console.log(res);
    }).fail(function (ress) {
        console.log(ress);
    });
}

function toggleInput(obj) {
    if (obj.checked) {
        $(obj).parents('td').next().find('input').css("display", "block");
    } else {
        $(obj).parents('td').next().find('input').css("display", "none");
    }
    exibiTotal();
}

function exibiTotal() {
    var $arrProduto = document.getElementsByClassName('toggles');
    var total = 0;
    
    for (const item of $arrProduto) {
        if (item.checked) {
            var _linha = $(item).parents('tr');
            total += _linha.find('.produtoQtd input').val() * _linha.find('.produtoPreco').text();
        }
    }
    
    $(".resultValorTotal").val(total);
}