<?php

require_once '../classes/Conexao.php';
require_once '../classes/CRUDVenda.php';
require_once '../classes/CRUDCaderneta.php';


switch ($_POST['acao']) {

    case "listaPico":
        $obj = new CRUDCaderneta();
        $obj->listaPico( $_POST["dataIni"] );
        break;

    default:
        break;
}
