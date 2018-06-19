<?php

require_once 'Conexao.php';

class CRUDProduto {

    private $nome;
    private $descricao;
    private $quantidade;
    private $preco;
    private $categoria;
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

    function getQuantidade() {
        return $this->quantidade;
    }

    function getPreco() {
        return $this->preco;
    }

    function getCategoria() {
        return $this->categoria;
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

    function setQuantidade($quantidade) {
        $this->quantidade = $quantidade;
    }

    function setPreco($preco) {
        $this->preco = $preco;
    }

    function setCategoria($categoria) {
        $this->categoria = $categoria;
    }

    function setConn($conn) {
        $this->conn = $conn;
    }

    public function cadastra($nome,$descricao,$quantidade,$preco,$categoria) {
        $sql = $this->conn->conectar()->prepare("INSERT INTO `produto`(`nome`, `descricao`, `quantidade`, `categoria_nome`, `preco`) VALUES ( :nome,:descricao,:quantidade,:categoria_nome,:preco);");
        $sql->bindParam(":nome", $nome, PDO::PARAM_STR);
        $sql->bindParam(":descricao", $descricao, PDO::PARAM_STR);
        $sql->bindParam(":quantidade", $quantidade, PDO::PARAM_INT);
        $sql->bindParam(":preco", $preco, PDO::PARAM_INT);
        $sql->bindParam(":categoria_nome", $categoria, PDO::PARAM_STR);
        $sql->execute();
    }
        
    public function listar() {
        $sql = $this->conn->conectar()->prepare("SELECT * FROM produto");
        $sql->execute();
        echo json_encode($sql->fetchAll(PDO::FETCH_OBJ));
    }
    
//    public function listaCategoria() {
//        $sql = $this->conn->conectar()->prepare("SELECT * FROM categoria");
//        $sql->execute();
//        echo json_encode($sql->fetchAll(PDO::FETCH_OBJ));
//    }

    function editar($usuario_id, $nome, $cidade, $bairro, $rua, $complemento, $referencia, $email, $telefone, $cpf) {
        $sql = $this->conn->conectar()->prepare("UPDATE cliente SET nome='$nome', cidade='$cidade', bairro='$bairro',rua='$rua',complemento='$complemento',referencia='$referencia', email='$email', telefone='$telefone', cpf='$cpf' WHERE usuario_id='$usuario_id'");

        $sql->execute();
    }
    function debito($usuario_id, $quantidade) {
        $sql = $this->conn->conectar()->prepare("UPDATE produto SET quantidade = (quantidade - {$quantidade}) WHERE produto_id='$usuario_id'");
        $sql->execute();
    }

    function excluir($usu_codigo) {
        $sql = $this->conn->conectar()->prepare('DELETE FROM `cliente` WHERE usuario_id = :id');
        $sql->bindParam(":id", $usu_codigo);
        $sql->execute();
    }

}
