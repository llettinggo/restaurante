<?php

require_once 'Conexao.php';

class CRUDCliente {

    private $nome;
    private $cidade;
    private $bairro;
    private $rua;
    private $complemento;
    private $referencia;
    private $email;
    private $telefone;
    private $cpf;
    private $conn;

    function __construct() {
        $this->conn = new Conexao();
    }

    function getNome() {
        return $this->nome;
    }

    function getCidade() {
        return $this->cidade;
    }

    function getBairro() {
        return $this->bairro;
    }

    function getRua() {
        return $this->rua;
    }

    function getComplemento() {
        return $this->complemento;
    }

    function getReferencia() {
        return $this->referencia;
    }

    function getEmail() {
        return $this->email;
    }

    function getTelefone() {
        return $this->telefone;
    }

    function getCpf() {
        return $this->cpf;
    }

    function setNome($nome) {
        $this->nome = $nome;
    }

    function setCidade($cidade) {
        $this->cidade = $cidade;
    }

    function setBairro($bairro) {
        $this->bairro = $bairro;
    }

    function setRua($rua) {
        $this->rua = $rua;
    }

    function setComplemento($complemento) {
        $this->complemento = $complemento;
    }

    function setReferencia($referencia) {
        $this->referencia = $referencia;
    }

    function setEmail($email) {
        $this->email = $email;
    }

    function setTelefone($telefone) {
        $this->telefone = $telefone;
    }

    function setCpf($cpf) {
        $this->cpf = $cpf;
    }

    public function cadastra($nome, $cidade, $bairro, $rua, $complemento, $referencia, $email, $telefone, $cpf) {
        $sql = $this->conn->conectar()->prepare("INSERT INTO `cliente`(`nome`, `cidade`, `bairro`, `rua`, `complemento`, `referencia`, `email`, `telefone`, `cpf`)VALUES ( :nome,:cidade,:bairro,:rua,:complemento,:referencia,:email,:telefone,:cpf);");
        //$sql = $this->conn->conectar()->prepare("INSERT INTO `cliente`(`nome`)VALUES ( :nome);");
        $sql->bindParam(":nome", $nome, PDO::PARAM_STR);
        $sql->bindParam(":cidade", $cidade, PDO::PARAM_STR);
        $sql->bindParam(":bairro", $bairro, PDO::PARAM_STR);
        $sql->bindParam(":rua", $rua, PDO::PARAM_STR);
        $sql->bindParam(":complemento", $complemento, PDO::PARAM_STR);
        $sql->bindParam(":referencia", $referencia, PDO::PARAM_STR);
        $sql->bindParam(":email", $email, PDO::PARAM_STR);
        $sql->bindParam(":telefone", $telefone, PDO::PARAM_INT);
        $sql->bindParam(":cpf", $cpf, PDO::PARAM_STR);
        $sql->execute();
    }

    public function listar() {
        $sql = $this->conn->conectar()->prepare("SELECT * FROM cliente");
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
