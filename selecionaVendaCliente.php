<!DOCTYPE html>
<html lang="pt">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Restaurante</title>

        <!-- Bootstrap -->
        <link rel="stylesheet" href="css/bootstrap.css">
        <!--<link href="lib/dataTable/datatables.min.css" rel="stylesheet" type="text/css"/>-->
        <link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/css/bootstrap-combined.min.css" rel="stylesheet" id="bootstrap-css">
        <script src="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/js/bootstrap.min.js"></script>
        <script src="//code.jquery.com/jquery-1.11.1.min.js"></script>


    </head>
    <body>
        <nav class="navbar-custom">
            <div class="container"> 

                <!-- Brand and toggle get grouped for better mobile display -->
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false"> <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button>
                    <a class="navbar-brand" href="index.html">Inicio.</a> </div>
            </div>
            <!-- /.container-fluid --> 
        </nav>

        <p></p>
        <p></p>
        <div id="teste" class="container">
            <div class="row">
                <div class="menu">
                    <form method="post" action="javascript:enviar()" name="cadastro" novalidate>
                        <div class="accordion" id="categ">
                            <div class='accordion-group'>
                                <div class='accordion-heading area'>
                                    <!--Áreas--> 

                                    <?php
                                    require_once './classes/Conexao.php';
                                    $con;
                                    $con = new Conexao();
                                    $sql = $con->conectar()->prepare("SELECT * FROM categoria");
                                    $sqlp = $con->conectar()->prepare("SELECT * FROM produto");
                                    $sqlc = $con->conectar()->prepare("SELECT * FROM cliente");
                                    $sql->execute();
                                    $sqlp->execute();
                                    $sqlc->execute();
                                    $vetor = $sql->fetchAll();
                                    $vetorp = $sqlp->fetchAll();
                                    $vetorc = $sqlc->fetchAll();
                                    ?>
                                    <h1>Selecione o Cliente</h1>
                                    <div class="accordion-group">    
                                        <div class="accordion-heading area">
                                            <a class="accordion-toggle navbar-custom" data-toggle="collapse" href="#clientes">Clientes</a>
                                        </div>


                                        <div class="accordion-body collapse" id="clientes">
                                            <div class="accordion-inner">
                                                <div class="accordion" id="equipamento0">
                                                    <input list="nomesClientes" name="cliente" class="form-control form-group-lg userId" autocomplete="off" required />
                                                    <datalist id="nomesClientes">
                                                        <?php foreach ($vetorc as $rowc) { ?>
                                                            <option value="<?= $rowc['nome'] ?>" class="listNomes"><?= $rowc['usuario_id'] ?></option>
                                                            <?php
                                                        }
                                                        ?>
                                                    </datalist>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <h1>Categorias e Produtos</h1>
                                    <?php foreach ($vetor as $row) { ?>

                                        <div class="accordion-group">    
                                            <div class="accordion-heading area">
                                                <a class="accordion-toggle navbar-custom" data-toggle="collapse" href="#<?php echo $row['categoria_id'] ?>"><?php echo $row['nome'] ?></a>
                                            </div>


                                            <div class="accordion-body collapse" id="<?php echo $row['categoria_id'] ?>">
                                                <div class="accordion-inner">
                                                    <div class="accordion" id="equipamento1">
                                                        <table class="table table-striped" cellspacing="0" cellpadding="0" id="tbl">
                                                            <thead>
                                                                <tr>
                                                                    <th>AÇÃO</th>
                                                                    <th>QUANTIDADE</th>
                                                                    <th>ID</th>
                                                                    <th>NOME</th>
                                                                    <th>ESTOQUE</th>
                                                                    <th>PREÇO</th>
                                                                </tr>
                                                            </thead>
                                                            <?php foreach ($vetorp as $rowp) { ?> 
                                                                <tr>
                                                                    <?php if ($rowp['categoria_nome'] == $row['nome']) { ?>
                                                                        <?php// $aux = $rowp['nome'] ?>
                                                                        <td><input type="checkbox" class="toggles" onClick="toggleInput(this)" <?php
                                                                            if ($rowp['quantidade'] == 0) {
                                                                                echo "disabled";
                                                                            }
                                                                            ?> ></td>
                                                                        <td class="produtoQtd"><input type="number" value="1" style="display: none" id="<?php echo $rowp['nome'] ?>" max="<?php echo $rowp['quantidade'] ?>" min="1" onblur="exibiTotal()" ></td>   
                                                                        <td class="produtoId"><?php echo $rowp['produto_id'] ?></td>
                                                                        <td class="produtoNom"><?php echo $rowp['nome'] ?></td>
                                                                        <td><?php echo $rowp['quantidade'] ?></td>
                                                                        <td class="produtoPreco"><?php echo $rowp['preco'] ?></td>
                                                                    </tr>
                                                                    <?php
                                                                }
                                                            }
                                                            ?>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    <?php } ?>
                                </div>
                            </div>
                            <label>Total: </label>
                            <input class="resultValorTotal form-control" />
                        </div><!-- /accordion -->
                        <div class="form-group">
                        <select class="form-control" name="pagamen" id="pagamen">  
                            <option selected="selected">Selecione Forma de Pagamento</option>
                            <option>Avista</option>
                            <option >Caderneta</option>
                        </select>
                    </div>
                        <br>
                        <input type="submit" class="btn btn-primary" value="Fechar Venda">
                    </form>
                </div> 
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
        <script src="js/jquery-1.11.3.min.js"></script> 
        <!-- Include all compiled plugins (below), or include individual files as needed --> 
        <script src="js/bootstrap.js"></script>
        <!--<script src="lib/dataTable/datatables.min.js" type="text/javascript"></script>-->
        <script src="js/listaclientevenda.js"></script>
    </body>
</html>