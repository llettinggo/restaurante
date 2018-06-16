<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Conexao
 *
 * @author Violeiro-PC
 */
class Conexao {

    protected $root;
    protected $senha;
    protected $host;
    protected $banco;
    private static $conn;
    
    function __construct() {
        $this->root = "root";
        $this->senha = "david123";
       $this->host = "localhost";
       $this->banco = "restaurante";
}
    
    public function conectar(){
        try{
            if (is_null(self::$conn)) {
                self::$conn = new PDO("mysql:host=".$this->host.";dbname=".$this->banco.";charset=utf8", $this->root, $this->senha, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
            }
            return self::$conn;
        } catch (PDOException $ex) {
            $ex->getMessage();
            echo'deu merda';
        }
    }

}
