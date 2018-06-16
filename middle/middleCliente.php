<?php

require_once '../classes/Conexao.php';
require_once '../classes/CRUDCliente.php';
switch ($_POST['acao']) {

    case "cadastra":
        $obj = new CRUDCliente();
        $obj->cadastra($_POST['nome'], $_POST['cidade'], $_POST['bairro'], $_POST['rua'], $_POST['complemento'], $_POST['referencia'], $_POST['email'], $_POST['telefone'], $_POST['cpf']);
        //$obj->cadastra($_POST['nome']);
        break;
    case 'exibir':
        $obj = new CRUDCliente();
        $obj->listar();
        break;
    case 'editar':
        $obj = new CRUDCliente();
        $obj->editar($_POST['id'], $_POST['nome'], $_POST['cidade'], $_POST['bairro'], $_POST['rua'], $_POST['complemento'], $_POST['referencia'], $_POST['email'], $_POST['telefone'], $_POST['cpf']);
        break;
    case 'excluir':
        $obj = new CRUDCliente();
        $obj->excluir($_POST['id']);
        break;
    default:
        break;
}
