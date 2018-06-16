function pagar(id){
    $.ajax({
        url: './middle/middleCaderneta.php',
        data: {acao: "pagar",'id': id},
        method: "post",
        dataType: "json"
    
    }).fail(function (e){
        location.reload();
    });
}
$(function () {
    var url = window.location.search.replace("?", "");
    moment.locale("pt-br");
    now = new Date;
    var data = now.getDate();
    $.ajax({
        url: './middle/middleCaderneta.php',
        data: {acao: "exibir"},
        method: "post",
        dataType: "json"
    }).done(function (ress) {
        console.log(ress);
        ress.forEach(function (e) {

            if (url === e.usuario_id) {
                var pagou = e.pagamento === 'Sim'? "disabled":"";
                var corPagamento = e.pagamento === 'Sim'? "text-success glyphicon glyphicon-ok":"text-danger glyphicon glyphicon-remove";
                $('#tbl tbody').append(
                        "<tr><td style='display:none'>" + e.usuario_id + "</td><td>" + moment(e.data).utc().format('LLLL') + "</td><td> <div class='btn-group '>\n\
                    <a title='Listar Produtos' class='btn-sm btn-warning' data-toggle='modal' id='btnEditar' data-target='#ModalListaProdutos'\n\
                    data-id='" + e.venda_id + "' data-nome='" + e.nome + "' data-descricao='" + e.descricao + "'>Produtos da Venda</a>\n\
                    </div></td><td class='"+ corPagamento +"'>" + e.pagamento + "</td><td> <input onclick='pagar("+e.venda_id+")' class='btn btn-sm btn-success' type='submit' value='Pagar' "+ pagou +"> </td></tr>"
                        );
            }
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



$('#ModalListaProdutos').on('show.bs.modal', function (event) {

    var button = $(event.relatedTarget); // Button that triggered the modal
    var total = 0;
    var recipient = button.data('id');
    var modal = $(this);
    var nome;
    modal.find('#id').val(recipient);
    $(function () {
        $.ajax({
            url: './middle/middleCaderneta.php',
            data: {acao: "exibirProdutos"},
            method: "post",
            dataType: "json"
        }).done(function (ress) {
            console.log(ress);
            total = 0;
            var a = 0;
            ress.forEach(function (e) {

                if (recipient == e.venda_id) {
                    $('#tb tbody').append(
                            "<tr><td>" + e.produto_nome + "</td><td>" + e.quantidade + "</td><td class='precop'>" + (e.preco * e.quantidade) + "</span> </td></tr>"
                            );
//                    $(".precop").each(function () {
                    total += (e.preco * e.quantidade);
//                    });
                }

            });
            $('#resultado').text(" R$ " + total);
            $('#tb').DataTable({
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

});
