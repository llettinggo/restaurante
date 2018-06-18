<!DOCTYPE html>

<html lang="pt">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Cadastro</title>
        <!-- Bootstrap -->
        <link rel="stylesheet" href="css/bootstrap.css">

    </head>
    <body>
        <nav class="navbar-custom">
            <div class="container"> 

                <!-- Brand and toggle get grouped for better mobile display -->
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false"> <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button>
                    <a class="navbar-brand" href="index.html">Inicio</a> </div> 
        </nav>
        <p></p>
        <p></p>
        <div class="container">
            <br>
            <br>
            <label>Selecione a data:</label>
            <br>
            <div class="col-md-3">
                <form method="post" action="javascript:enviar()" enctype="multipart/form-data" name="cadastro">
                    <input type="date" class="form-control input-md" name="dataIni" id="dataIni" placeholder="dd/mm/aaaa">
                    <input type="submit" class="btn btn-primary" value="Cadastrar">
                </form>

            </div>
            
            <div id="container" style="margin-top: 30px"></div>

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
        
        <script src="https://code.highcharts.com/highcharts.src.js"></script>
        <script src="../../code/highcharts.js"></script>
        <script src="../../code/modules/exporting.js"></script>
        <script src="../../code/modules/export-data.js"></script>
        
        <!--<script src="lib/dataTable/datatables.min.js" type="text/javascript"></script>-->
        <script src="js/listaRelatorioPico.js"></script>
    </body>
</html>