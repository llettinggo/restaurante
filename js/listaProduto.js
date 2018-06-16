/* global cadastro, excluirc */

function enviardeleta() {
    var pessoas = {
        acao: excluirc.acao.value,
        id: excluirc.id.value,
        nome: excluirc.nome.value
    };

    $.ajax({
        url: './middle/middleCliente.php',
        data: pessoas,
        method: "post"
    }).done(function (ress) {

    }).fail(function (ress) {
        console.log(ress);
    });
    alert('Usuário Excluido!'), history.back();
    parent.location = "javascript:location.reload()";
}
function enviar() {
    var pessoa = {
        acao: cadastro.acao.value,
        id: cadastro.id.value,
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
                                url: './middle/middleProduto.php',
                                data: pessoa,
                                method: "post"
                            }).done(function (ress) {

                            }).fail(function (ress) {
                                console.log(ress);
                            });
                            alert('Usuário editado!'), history.back();
                            parent.location = "javascript:location.reload()";
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
$(function () {
    $.ajax({
        url: './middle/middleProduto.php',
        data: {acao: "exibir"},
        method: "post",
        dataType: "json"
    }).done(function (ress) {
        console.log(ress);
        ress.forEach(function (e) {
            $('#tbl tbody').append("<tr><td>" + e.produto_id + "</td><td> <div class='btn-group '><a title='Editar Cliente' class='btn-sm btn-success' data-toggle='modal' id='btnEditar' data-target='#ModalEdita' data-id='" + e.produto_id + "' data-descricao='" + e.descricao + "' data-quantidade='" + e.quantidade + "'\
            data-preco='" + e.categoria_nome + "' data-preco='" + e.preco + "'><span class='glyphicon glyphicon-edit'></span></a><a title='Excluir Cliente' class='btn-sm btn-danger' data-toggle='modal' data-target='#ModalDeleta' data-id='" + e.produto_id + "' data-nome='" + e.nome + "'><span class='glyphicon glyphicon-remove-sign'></span></a></div></td><td>" + e.nome + "</td><td>" + e.descricao + "</td><td>" + e.quantidade + "</td><td>" + e.categoria_nome + "</td><td>" + e.preco + "</td></tr>");
        });
        $('#tbl').DataTable({
            "language": {
                "search": "Buscar:",
                "lengthMenu": "Mostrar _MENU_ Por vez",
                "infoEmpty": "Mostrando 0 De 0 Em 0 Itens",
                "info": "Mostrando _START_ De _END_ Em _TOTAL_ Itens",
                "paginate": {
                    "next": 'Próximo',
                    "previous": 'Anterior'
                    
                }
            },
            "responsive": true,

            "select": {
                "style": 'single'
            }
        });

    }).fail(function (ress) {
        console.log(ress);
    });
});

$('#ModalDeleta').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget); // Button that triggered the modal
    var recipient = button.data('id');
    var recipientnome = button.data('nome');
    var modal = $(this);
    modal.find('#id').val(recipient);
    modal.find('#nome').val(recipientnome);
});
$('#ModalEdita').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget); // Button that triggered the modal
    var recipient = button.data('id');
    //console.log(button.data('nome'));
    var recipientnome = button.data('nome');
    var recipientcidade = button.data('descricao');
    var recipientbairro = button.data('quantidade');
    var recipientrua = button.data('categoria');
    var recipientcomplemento = button.data('complemento');
    var recipientreferencia = button.data('referencia');
    var recipientemail = button.data('email');
    var recipienttelefone = button.data('telefone');
    var recipientcpf = button.data('cpf');
    var modal = $(this);
    modal.find('#id').val(recipient);
    modal.find('#nome').val(recipientnome);
    modal.find('#cidade').val(recipientcidade);
    modal.find('#bairro').val(recipientbairro);
    modal.find('#rua').val(recipientrua);
    modal.find('#complemento').val(recipientcomplemento);
    modal.find('#referencia').val(recipientreferencia);
    modal.find('#email').val(recipientemail);
    modal.find('#telefone').val(recipienttelefone);
    modal.find('#cpf').val(recipientcpf);
});