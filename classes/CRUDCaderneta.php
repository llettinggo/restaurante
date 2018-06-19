<?php

require_once 'Conexao.php';

class CRUDCaderneta {

    
    private $conn;

    function __construct() {
        $this->conn = new Conexao();
    }

//    public function cadastra($cliente,$data,$pagamento) {
    public function cadastra($venda_id,$produto_id,$quantidade,$produto_nome,$data,$preco) {

        $sql = $this->conn->conectar()->prepare("INSERT INTO `caderneta`(`venda_id`, `produto_id`, `quantidade`,`produto_nome`, `preco`, `data`) VALUES (:venda_id,:produto_id,:quantidade,:produto_nome,:data,:preco);");
        $sql->bindParam(":venda_id", $venda_id, PDO::PARAM_INT);
        $sql->bindParam(":produto_id", $produto_id, PDO::PARAM_INT);
        $sql->bindParam(":quantidade", $quantidade, PDO::PARAM_INT);
        $sql->bindParam(":produto_nome", $produto_nome, PDO::PARAM_STR);
        $sql->bindParam(":data", $data, PDO::PARAM_STR);
        $sql->bindParam(":preco", $preco, PDO::PARAM_INT);
        $sql->execute();
    }
        
    public function listar() {
        $sql = $this->conn->conectar()->prepare("SELECT * FROM caderneta");
        $sql->execute();
        echo json_encode($sql->fetchAll(PDO::FETCH_OBJ));
    }
    public function listarVenda() {
        $sql = $this->conn->conectar()->prepare("SELECT * FROM venda");
        $sql->execute();
        echo json_encode($sql->fetchAll(PDO::FETCH_OBJ));
    }
    
    public function listaPico($data) {
        $data1 = $data.'T00:00:00';
        $data2 = $data.'T23:59:59';
        $sql = $this->conn->conectar()->prepare("SELECT COUNT(`produto_id`) AS 'qtd', HOUR(CAST(`data` AS DATETIME)) AS 'hora' FROM `caderneta` WHERE `data` BETWEEN '$data1' AND '$data2' GROUP BY HOUR(CAST(`data` AS DATETIME))");
        $sql->execute();
        echo json_encode($sql->fetchAll(PDO::FETCH_OBJ));
    }

    function editar($usuario_id, $nome, $cidade, $bairro, $rua, $complemento, $referencia, $email, $telefone, $cpf) {
        $sql = $this->conn->conectar()->prepare("UPDATE cliente SET nome='$nome', cidade='$cidade', bairro='$bairro',rua='$rua',complemento='$complemento',referencia='$referencia', email='$email', telefone='$telefone', cpf='$cpf' WHERE usuario_id='$usuario_id'");

        $sql->execute();
    }
    
    function editarPagar($usuario_id) {
        $sql = $this->conn->conectar()->prepare("UPDATE `venda` SET `pagamento` = 'Sim' WHERE `venda`.`venda_id` = $usuario_id");
        $sql->execute();
    }

    function excluir($usu_codigo) {
        $sql = $this->conn->conectar()->prepare('DELETE FROM `cliente` WHERE usuario_id = :id');
        $sql->bindParam(":id", $usu_codigo);
        $sql->execute();
    }

}
