
/* global cadastro */

function enviar() {

    var pessoa = {
        acao: cadastro.acao.value,
        nome: cadastro.nome.value,
        descricao: cadastro.descricao.value
    };
    if (pessoa.nome !== '') {
        if (pessoa.descricao !== '') {
            $.ajax({
                url: './middle/middleCategoria.php',
                data: pessoa,
                method: "post"
            }).done(function (ress) {
                    console.log(ress);
            }).fail(function (ress) {
                console.log(ress);
            });
            alert('Usuário cadastrado com sucesso.'), parent.location = "javascript:location.reload()";

        } else {
            alert('Insira Uma Descrição');
        }
    } else {
        alert('Insira Um Nome');
    }


}
