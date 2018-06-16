<?php

require_once 'Conexao.php';

class CRUDVenda {

    
    private $conn;

    function __construct() {
        $this->conn = new Conexao();
    }

//    public function cadastra($cliente,$data,$pagamento) {
    public function cadastra($venda) {
        //echo ($venda);
        $sql = $this->conn->conectar()->prepare("INSERT INTO `venda`(`usuario_id`, `data`, `pagamento`) VALUES (:cliente,:data,:pagamento);");
        $sql->bindParam(":cliente", $venda->cliente, PDO::PARAM_INT);
        $sql->bindParam(":data", $venda->data, PDO::PARAM_STR);
        $sql->bindParam(":pagamento", $venda->pagamento, PDO::PARAM_STR);
        $sql->execute();
    }
        
    public function listar() {
        $sql = $this->conn->conectar()->prepare("SELECT * FROM produto");
        $sql->execute();
        echo json_encode($sql->fetchAll(PDO::FETCH_OBJ));
    }


    function editar($usuario_id, $nome, $cidade, $bairro, $rua, $complemento, $referencia, $email, $telefone, $cpf) {
        $sql = $this->conn->conectar()->prepare("UPDATE cliente SET nome='$nome', cidade='$cidade', bairro='$bairro',rua='$rua',complemento='$complemento',referencia='$referencia', email='$email', telefone='$telefone', cpf='$cpf' WHERE usuario_id='$usuario_id'");

        $sql->execute();
    }

    function excluir($usu_codigo) {
        $sql = $this->conn->conectar()->prepare('DELETE FROM `cliente` WHERE usuario_id = :id');
        $sql->bindParam(":id", $usu_codigo);
        $sql->execute();
    }

}
