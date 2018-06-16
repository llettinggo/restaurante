<?php

require_once "config.php";
$identificador = $_GET['produto'];
$idu = $_GET['idu'];
$preco = $GET['preco'];

$sql_code = "SELECT * FROM caderneta";

//$sql_query = $mysql->query($sql_code) or die("error");
$query = mysql_query($sql_code) or die(mysql_error());
if($query){
    
    $preco = $_GET['preco'];
    echo("<script>
            alert('$preco');
 </script>;
");
    mysql_query("insert into caderneta (usuario_id, produto,preco) values ('$idu', '$identificador','$preco')")or die("Erro");
    echo("<script>
            location.href='listaProduto.php';
 </script>;
");
}else{
    echo"
<script>
    alert('Não foi possivel deletar o usuario.');
    location.href='listaProduto.php';
</script>      
";
}

?>
