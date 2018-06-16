<?php

require_once '../classes/Conexao.php';
require_once '../classes/CRUDVenda.php';
require_once '../classes/CRUDCaderneta.php';


switch ($_POST['acao']) {

    case "cadastra":
        
        $venda = json_decode($_POST["dados"]);

        $obj = new CRUDVenda();          
        $conn = new Conexao();
        $obj->cadastra($venda);
        
        
        $res = $conn->conectar()->prepare('SELECT COUNT(*) FROM venda');
        $res->execute();
        $num_rows = $res->fetchColumn();
        $objto = new CRUDCaderneta();
        $max=sizeof($venda->produtos);
        for($i =0; $i<$max;$i++){
            $objto->cadastra($num_rows,$venda->produtos[$i]->id,$venda->produtos[$i]->qtd,$venda->produtos[$i]->nom);
        }
        

        break;

    default:
        break;
}
