
/* global cadastro */

function enviar() {

    var pessoa = {
        acao: cadastro.acao.value,
        nome: cadastro.nome.value,
        descricao: cadastro.descricao.value,
        quantidade: cadastro.quantidade.value,
        preco: cadastro.preco.value,
        categoria: cadastro.categoria.value
    };
    if (pessoa.nome !== '') {
        if (pessoa.descricao !== '') {
            if (pessoa.quantidade !== '') {
                if (pessoa.preco !== '') {
                    $.ajax({
                        url: './middle/middleProduto.php',
                        data: pessoa,
                        method: "post"

                    }).done(function (ress) {
                        console.log(ress)
                    }).fail(function (ress) {
                        console.log(ress);
                    });
                    //alert('Usuário cadastrado com sucesso.'), parent.location = "javascript:location.reload()";
                } else {
                    alert('Insira Um Preço');
                }
            } else {
                alert('Insira Uma Quantidade');
            }
        } else {
            alert('Insira Uma Descrição');
        }
    } else {
        alert('Insira Um Nome');
    }


}
$(function () {
    $.ajax({
        url: './middle/middleProduto.php',
        data: {acao: "listaCategoria"},
        method: "post",
        dataType: "json"
    }).done(function (ress) {
        ress.forEach(function (e) {
            console.log(e);
            $('#categoria').append("<option value='" + e.nome + "'>" + e.nome + "</option>");
        });
    }).fail(function (ress) {
        console.log(ress);
    });
});
