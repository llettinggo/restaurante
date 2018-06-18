<?php
header('Content-Type: text/html; charset=utf-8');
?>

<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Cadastro</title>

        <!-- Bootstrap -->
        <link rel="stylesheet" href="css/bootstrap.css">
        <link href="lib/dataTable/datatables.min.css" rel="stylesheet" type="text/css"/>

        <style type="text/css">
            .Cadastro {
            }
        </style>

    </head>
    <body>
        <nav class="navbar-custom">
            <div class="container"> 

                <!-- Brand and toggle get grouped for better mobile display -->
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false"> <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button>
                    <a class="navbar-brand" href="index.html">Inicio</a> </div>

            </div>
            <!-- /.container-fluid --> 
        </nav>
        <p></p>
        <p></p>    
        <div class="container">

            <form id="buscaData" method="post" enctype="multipart/form-data">
                <br>
                <label>Selecione o Intervalo da data.</label>
                <br>
                <div class="col-md-3">
                    <input type="date" class="form-control input-md" name="dataIni" id="dataIni" placeholder="dd/mm/aaaa"/>
                </div>
                <br>
                <br>
                <div class="col-md-3">
                    <input type="date" class="form-control input-md" name="dataFim" id="dataFim" placeholder="dd/mm/aaaa"/>
                </div>
                <br>
                <br>
                <input type="submit" class="btn btn-warning" value="Buscar" id="acao" onclick="loadDoc()">
            </form>
            <?php
            require_once './classes/Conexao.php';
            $con;
            $con = new Conexao();
            $sql = $con->conectar()->prepare("SELECT * FROM caderneta");
            $sqlp = $con->conectar()->prepare("SELECT * FROM produto");
            $sqlv = $con->conectar()->prepare("SELECT * FROM venda");
            $sql->execute();
            $sqlp->execute();
            $sqlv->execute();
            $vetor = $sql->fetchAll();
            $vetorp = $sqlp->fetchAll();
            $vetorv = $sqlv->fetchAll();
            $total = 0;
            $totalv = 0;
            $flagp = 0;
            $flagv = 0;
            setlocale(LC_ALL, 'pt_BR', 'pt_BR.iso-8859-1', 'pt_BR.utf-8', 'portuguese');
            date_default_timezone_set('America/Fortaleza');
            ?>
            <br>
            <hr style="height:2px; border:none; color:#fdbb3b; background-color:#fdbb3b; margin-top: 0px; margin-bottom: 0px;"/>
            <br>
            <br>
            <div class="form-group" id="statusVenda">
                <table class="table table-striped" cellspacing="0" cellpadding="0" id="tbl">
                    <thead>
                        <tr>
                            <th class="actions">Quantidade Vendida</th>
                            <th>Data</th>
                        </tr>
                    </thead>
                    <?php
                    $inicio = strtotime($_POST['dataIni']);
                    $end = strtotime($_POST['dataFim']);
                    if(!empty($inicio)){
                        
                    
                    for ($i = $inicio; $i <= $end; $i = $i + 86400) {
                        ?>
                        <tr>
                            <?php
                            foreach ($vetor as $row) {
                                $a = strftime("Dia %d, %A de %B de %Y", $i);
                                $b = strftime("Dia %d, %A de %B de %Y", strtotime($row['data']));
                                ?>

                                <?php
                                if ($a == $b) {
                                    ?>
                                    <?php $totalv += $row['quantidade']; ?>
                                    <?php
                                    $flagv = 1;
                                }
                            }
                            ?>
                            <td><?php echo $totalv ?></td>
                            <td><?php $p = $i;
                        echo $p = strftime("Dia %d, %A de %B de %Y", $i);
                            ?></td>
                        </tr>
                        <?php $totalv = 0 ?>

<?php } 
}?>
                </table>
            </div>
        </div>
        <footer class="text-center">
            <div class="container">
                <div class="row">
                    <div class="col-xs-12">
                        <p>D.Soluções ©. TODOS OS DIREITOS RESERVADOS.</p>
                    </div>
                </div>
            </div>
        </footer>

        <!-- jQuery (necessary for Bootstrap's JavaScript plugins) --> 
        <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script> 
        <!-- Include all compiled plugins (below), or include individual files as needed --> 
        <script src="js/bootstrap.js"></script>
        <script src="lib/dataTable/datatables.min.js" type="text/javascript"></script>
        <script src="js/listaRelatorioVenda.js"></script>
    </body>
</html>