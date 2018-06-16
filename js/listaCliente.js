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
                                url: './middle/middleCliente.php',
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

function teste(){
    alert('teste')
}

$(function () {
    $.ajax({
        url: './middle/middleCliente.php',
        data: {acao: "exibir"},
        method: "post",
        dataType: "json"
    }).done(function (ress) {
        console.log(ress);
        ress.forEach(function (e)  {
            $('#tbl tbody').append("<tr><td>" + e.usuario_id + "</td><td> <div class='btn-group btn-group-justified'><a title='Editar Cliente' class='btn  btn-success' data-toggle='modal' id='btnEditar' data-target='#ModalEdita' data-id='" + e.usuario_id + "'\
                                                     data-nome='" + e.nome + "' data-cidade='" + e.cidade + "' data-bairro='" + e.bairro + "' data-rua='" + e.rua + "'\
                                                      data-complemento='" + e.complemento + "' data-referencia='" + e.referencia + "' data-email='" + e.email + "'\
                                                     data-telefone='" + e.telefone + "' data-cpf='" + e.cpf + "'><span class='glyphicon glyphicon-edit'></span></a> <a title='Caderneta Cliente' class='btn btn-warning' href='/restaurante/listaCaderneta.html?"+ e.usuario_id +"'><span class='glyphicon glyphicon-comment'></span></a> <a title='Excluir Cliente' class='btn btn-danger' data-toggle='modal' data-target='#ModalDeleta' data-id='" + e.usuario_id + "' data-nome='" + e.nome + "'><span class='glyphicon glyphicon-remove-sign'></span></a></div></td><td>" + e.nome + "</td><td>" + e.cidade + "</td><td>" + e.bairro + "</td><td>" + e.rua + "</td><td>" + e.complemento + "</td><td>" + e.referencia + "</td><td>" + e.email + "</td><td>" + e.telefone + "</td><td>" + e.cpf + "</td></tr>");

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
    var recipientcidade = button.data('cidade');
    var recipientbairro = button.data('bairro');
    var recipientrua = button.data('rua');
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
