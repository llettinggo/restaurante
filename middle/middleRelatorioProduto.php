<?php

require_once '../classes/Conexao.php';
require_once '../classes/CRUDCaderneta.php';

switch ($_POST['acao']) {
    case 'Produto':
        $obj = new CRUDCaderneta();
        $obj->listar();
        break;
    case 'Venda':
        $obj = new CRUDCaderneta();
        $obj->listar();
        break;
}
