
/* global cadastro */

function enviar() {

    var pessoa = {
        acao: cadastro.acao.value,
        nome: cadastro.nome.value,
        cidade: cadastro.cidade.value,
        bairro: cadastro.bairro.value,
        rua: cadastro.rua.value,
        complemento: cadastro.complemento.value,
        referencia: cadastro.referencia.value,
        email: cadastro.email.value,
        telefone: cadastro.telefone.value,
        cpf: cadastro.cpf.value
    };
    if (pessoa.nome !== '') {
        if (pessoa.cidade !== '') {
            if (pessoa.bairro !== '') {
                if (pessoa.rua !== '') {
                    if (pessoa.telefone !== '') {
                        if (pessoa.cpf !== '') {
                            $.ajax({
                                url: './middle/middleCliente.php',
                                data: pessoa,
                                method: "post"
                            }).done(function (ress) {
								console.log(ress);
                            }).fail(function (ress) {
                                console.log(ress);
                            });
                            alert('Usuário cadastrado com sucesso.'), parent.location = "javascript:location.reload()";
                                
                        } else {
                            alert('Insira Um Cpf');
                        }
                    } else {
                        alert('Insira Um Telefone');
                    }
                } else {
                    alert('Insira Uma Rua');
                }
            } else {
                alert('Insira Um Bairro');
            }
        } else {
            alert('Insira Uma Cidade');
        }
    } else {
        alert('Insira Um Nome');
    }


}
