<?php

require_once '../classes/Conexao.php';
require_once '../classes/CRUDProduto.php';
require_once '../classes/CRUDCategoria.php';

switch ($_POST['acao']) {

    case "cadastra":
        $obj = new CRUDProduto();
        $obj->cadastra($_POST['nome'], $_POST['descricao'],$_POST['quantidade'],$_POST['preco'],$_POST['categoria']);
        break;
    case 'exibir':
        $obj = new CRUDProduto();
        $obj->listar();
        break;
    case 'listaCategoria':
        $obj = new CRUDCategoria();
        $obj->listar();
        break;
    case 'editar':
        $obj = new CRUDProduto();
        $obj->editar($_POST['id'], $_POST['nome'], $_POST['cidade'], $_POST['bairro'], $_POST['rua'], $_POST['complemento'], $_POST['referencia'], $_POST['email'], $_POST['telefone'], $_POST['cpf']);
        break;
    case 'excluir':
        $obj = new CRUDProduto();
        $obj->excluir($_POST['id']);
        break;
    default:
        break;
}
