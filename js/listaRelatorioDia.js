function enviar() {

    var pessoa = {
        acao: cadastro.acao.value,
        id: cadastro.id.value,
        nome: cadastro.nome.value,
        descricao: cadastro.descricao.value
    };
    $.ajax({
        url: './middle/middleCategoria.php',
        data: pessoa,
        method: "post",
        dataType: "json"
    }).done(function (ress) {
        console.log(ress);
        ress.forEach(function (e) {
            $('#tbl tbody').append("<tr><td>" + e.categoria_id + "</td><td> <div class='btn-group '><a title='Editar Cliente' class='btn-sm btn-success' data-toggle='modal' id='btnEditar' data-target='#ModalEdita' data-id='" + e.categoria_id + "'\
                                                     data-nome='" + e.nome + "' data-descricao='" + e.descricao + "'><span class='glyphicon glyphicon-edit'></span></a><a title='Excluir Cliente' class='btn-sm btn-danger' data-toggle='modal' data-target='#ModalDeleta' data-id='" + e.categoria_id + "' data-nome='" + e.nome + "'><span class='glyphicon glyphicon-remove-sign'></span></a></div></td><td>" + e.nome + "</td><td>" + e.descricao + "</td></tr>");

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

}
//$(function () {
//    $.ajax({
//        url: './middle/middleCategoria.php',
//        data: {acao: "exibir"},
//        method: "post",
//        dataType: "json"
//    }).done(function (ress) {
//        console.log(ress);
//        ress.forEach(function (e) {
//            $('#tbl tbody').append("<tr><td>" + e.categoria_id + "</td><td> <div class='btn-group '><a title='Editar Cliente' class='btn-sm btn-success' data-toggle='modal' id='btnEditar' data-target='#ModalEdita' data-id='" + e.categoria_id + "'\
//                                                     data-nome='" + e.nome + "' data-descricao='" + e.descricao + "'><span class='glyphicon glyphicon-edit'></span></a><a title='Excluir Cliente' class='btn-sm btn-danger' data-toggle='modal' data-target='#ModalDeleta' data-id='" + e.categoria_id + "' data-nome='" + e.nome + "'><span class='glyphicon glyphicon-remove-sign'></span></a></div></td><td>" + e.nome + "</td><td>" + e.descricao + "</td></tr>");
//
//        });
//        $('#tbl').DataTable({
//            "language": {
//                "search": "Buscar:",
//                "lengthMenu": "Mostrar _MENU_ Por vez",
//                "infoEmpty": "Mostrando 0 De 0 Em 0 Itens",
//                "info": "Mostrando _START_ De _END_ Em _TOTAL_ Itens",
//                "paginate": {
//                    "next": 'Próximo',
//                    "previous": 'Anterior'
//
//                }
//            },
//            "responsive": true,
//            "select": {
//                "style": 'single'
//            }
//        });
//
//    }).fail(function (ress) {
//        console.log(ress);
//    });
//});