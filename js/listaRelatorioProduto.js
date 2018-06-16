/* global cadastro, excluirc */
$(function () {
    $.ajax({
        url: './middle/middleRelatorio.php',
        data: {acao: "exibir"},
        method: "post",
        dataType: "json"
    }).done(function (ress) {
        console.log(ress);
        ress.forEach(function (e) {
            
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