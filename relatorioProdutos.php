<!DOCTYPE html>


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
    <?php
    require_once './classes/Conexao.php';
    $con;
    $con = new Conexao();
    $sql = $con->conectar()->prepare("SELECT * FROM caderneta");
    $sqlp = $con->conectar()->prepare("SELECT * FROM produto");
    $sql->execute();
    $sqlp->execute();
    $vetor = $sql->fetchAll();
    $vetorp = $sqlp->fetchAll();
    ?>
    <div class="container">
        <select>
            <option>Selecionar Relatorio Por Produto ou por Venda</option>
            <option>Produto</option>
            <option>Venda</option>
        </select>
        <br>
        <br>
        <label>Selecione o Intervalo da data.</label>
        <br>
        <div class="col-md-3">
            <input type="date" class="form-control input-md" name="datac" id="data" placeholder="dd/mm/aaaa">
        </div>
        <br>
        <br>
        <div class="col-md-3">
            <input type="date" class="form-control input-md" name="datac" id="data" placeholder="dd/mm/aaaa">
        </div>
        <br>
        <br>
        <table class="table table-striped" cellspacing="0" cellpadding="0" id="tbl">
            <thead>
                <tr>
                    <th class="actions">Quantidade Vendida</th>
                    <th>Data ou Produto</th>

                </tr>
            </thead>
            <?php
            $total = 0;
            foreach ($vetorp as $rowp) {
                ?>
                <tr>
                    <?php $aux = $rowp['produto_id']; ?>                
                    <?php foreach ($vetor as $row) { ?>
                        <?php if ($row['produto_id'] == $aux) { ?>
                            <?php $total += $row['quantidade']; ?>
                        <?php } ?>
    <?php } ?>
                    <td><?php echo $total ?></td>
                    <td><?php echo $rowp['nome']; ?></td>
                </tr>
                <?php $total = 0 ?>
<?php } ?>

        </table>
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
    <script src="js/listaRelatorioProduto.js"></script>
</body>
</html>