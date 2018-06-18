<!DOCTYPE html>

<html lang="pt">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Cadastro</title>
        <script src="https://code.highcharts.com/highcharts.src.js"></script>
        <script src="../../code/highcharts.js"></script>
        <script src="../../code/modules/exporting.js"></script>
        <script src="../../code/modules/export-data.js"></script>
        <!-- Bootstrap -->
        <link rel="stylesheet" href="css/bootstrap.css">

    </head>
    <body>
        <nav class="navbar-custom">
            <div class="container"> 

                <!-- Brand and toggle get grouped for better mobile display -->
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false"> <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button>
                    <a class="navbar-brand" href="selecionaVendaCliente.html">Venda</a> </div> 
        </nav>
        <p></p>
        <p></p>
        <div class="container">
            <br>
            <br>
            <label>Selecione a data.</label>
            <br>
            <div class="col-md-3">
                <form method="post" action="javascript:enviar()" enctype="multipart/form-data" name="cadastro">
                    <input type="date" class="form-control input-md" name="datac" id="data" placeholder="dd/mm/aaaa">
                    <br>
                    <input type="date" class="form-control input-md" name="datac" id="data" placeholder="dd/mm/aaaa">
                </form>

            </div>
            <br>
            <br>
            <br>
            <br>
            <br>
            <h1>Relatorio referente ao dia: 04/06/2018. Segunda Feira</h1>
            <br>
            <br>
            <div id="container" style="min-width: 310px; height: 400px; margin: 0 auto"></div>



<!--        <script type="text/javascript">

            Highcharts.chart('container', {
                chart: {
                    type: 'line'
                },
                title: {
                    text: 'Monthly Average Temperature'
                },
                subtitle: {
                    text: 'Source: WorldClimate.com'
                },
                xAxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                },
                yAxis: {
                    title: {
                        text: 'Temperature (°C)'
                    }
                },
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: true
                        },
                        enableMouseTracking: false
                    }
                },
                series: [{
                        name: 'Tokyo',
                        data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                    }, {
                        name: 'London',
                        data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
                    }]
            });
        </script>-->

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
        <!--<script src="lib/dataTable/datatables.min.js" type="text/javascript"></script>-->
        <script src="js/listaRelatorioDia.js"></script>
    </body>
</html>