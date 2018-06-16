<?php

require_once '../classes/Conexao.php';
require_once '../classes/CRUDCategoria.php';
require_once '../classes/CRUDProduto.php';
require_once '../classes/CRUDCaderneta.php';

switch ($_POST['acao']) {

    case "cadastra":
        $obj = new CRUDCategoria();
        $obj->cadastra($_POST['nome'], $_POST['descricao']);
        break;
    case 'exibir':
        $obj = new CRUDCaderneta();
        $obj->listarVenda();
        break;
    case 'exibirProdutos':
        $obj = new CRUDCaderneta();
        $obj->listar();
        break;
    case 'editar':
        $obj = new CRUDCategoria();
        $obj->editar($_POST['id'], $_POST['nome'], $_POST['descricao']);
        break;
    case 'pagar':
        $obj = new CRUDCaderneta();
        $obj->editarPagar($_POST['id']);
        break;
    case 'excluir':
        $conn = new Conexao();
        $sql = $conn->conectar()->prepare("SELECT * FROM produto");
        $sql->execute();
        $vetor = $sql->fetchAll();
        $flag = 0;
        foreach ($vetor as $row) {
            if ($_POST['id'] == $row['categoria_id']) {
                $flag = 1;
                echo json_encode(false);
                break;
            }
        }
        if ($flag == 0) {
            $obj = new CRUDCategoria();
            $obj->excluir($_POST['id']);
            break;
        }

    default:
        break;
}
