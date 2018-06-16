<?php

require_once 'Conexao.php';

class CRUDCategoria {

    private $nome;
    private $descricao;
    private $conn;

    function __construct() {
        $this->conn = new Conexao();
    }

    function getNome() {
        return $this->nome;
    }

    function getDescricao() {
        return $this->descricao;
    }

    function getConn() {
        return $this->conn;
    }

    function setNome($nome) {
        $this->nome = $nome;
    }

    function setDescricao($descricao) {
        $this->descricao = $descricao;
    }

    function setConn($conn) {
        $this->conn = $conn;
    }

    
    public function cadastra($nome, $descricao) {
        $sql = $this->conn->conectar()->prepare("INSERT INTO `categoria` (`nome`, `descricao`) VALUES ( :nome,:descricao);");
        $sql->bindParam(":nome", $nome, PDO::PARAM_STR);
        $sql->bindParam(":descricao", $descricao, PDO::PARAM_STR);
        $sql->execute();
    }

    public function listar() {
        $sql = $this->conn->conectar()->prepare("SELECT * FROM categoria");
        $sql->execute();
        echo json_encode($sql->fetchAll(PDO::FETCH_OBJ));
    }

    function editar($categoria_id, $nome, $descricao) {
        echo($categoria_id);
        echo($nome);
        echo($descricao);
        $sql = $this->conn->conectar()->prepare("UPDATE categoria SET nome='$nome',descricao='$descricao' WHERE categoria_id='$categoria_id'");

        $sql->execute();
    }

    function excluir($usu_codigo) {
        $sql = $this->conn->conectar()->prepare('DELETE FROM `categoria` WHERE categoria_id = :id');
        $sql->bindParam(":id", $usu_codigo);
        $sql->execute();
    }

}
