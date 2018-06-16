<!DOCTYPE html>

<html lang="pt">
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
                <input type="date" class="form-control input-md" name="datac" id="data" placeholder="dd/mm/aaaa">
            </div>
            <br>
            <br>
            <h1>Relatorio referente ao dia: 04/06/2018. Segunda Feira</h1>
            <br>
            <br>
            <link  id='GoogleFontsLink' href='https://fonts.googleapis.com/css?family=Indie Flower' rel='stylesheet' type='text/css'><link  id='GoogleFontsLink' href='https://fonts.googleapis.com/css?family=Open Sans' rel='stylesheet' type='text/css'>
            <script>
                WebFontConfig = {
                    google:
                            {families: ["Indie Flower", "Open Sans", ]}, active: function () {
                        DrawTheChart(ChartData, ChartOptions, "chart-01", "Line")
                    }
                };
            </script>
            <script asyn src="https://livegap.com/charts/js/webfont.js">
            </script><script src="https://livegap.com/charts/js/Chart.min.js"></script>
            <script>
                function DrawTheChart(ChartData, ChartOptions, ChartId, ChartType) {
                    eval('var myLine = new Chart(document.getElementById(ChartId).getContext("2d")).' + ChartType + '(ChartData,ChartOptions);document.getElementById(ChartId).getContext("2d").stroke();')
                }
            </script>
        </head>
        <body>
            <canvas  id="chart-01" width="950px" height="500px"  style="background-color:rgba(255,255,255,1.00);border:4px rgba(140,145,6,1) solid;border-radius:0px;width:950px;height:500px;padding-left:0px;padding-right:0px;padding-top:0px;padding-bottom:0px"></canvas>
            <script> function MoreChartOptions() {} var ChartData = {labels: ["Seg",
                        "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom", ], datasets: [{fillColor: "rgba(255,0,43,1)", strokeColor: "rgba(52,152,219,0.5)", pointColor: "rgba(255,255,255,1.00)", markerShape: "circle", pointStrokeColor: "rgba(255,10,88,1)", data: [65, 42, 90, 81, 56, 55, 40, ], title: "03/06/2018 - 09/06/2018"}, {fillColor: "rgba(46,204,113,1)", strokeColor: "rgba(46,204,112,0.59)", pointColor: "rgba(255,255,255,1.00)", markerShape: "circle", pointStrokeColor: "rgba(46,204,113,1)", data: [NaN, NaN, NaN, NaN, NaN, NaN, NaN, ], title: ""}, ]};
                ChartOptions = {decimalSeparator: ".", thousandSeparator: ",", spaceLeft: 12, spaceRight: 12, spaceTop: 12, spaceBottom: 12, scaleLabel: "<%=value+''%>", yAxisMinimumInterval: 'none', scaleShowLabels: true, scaleShowLine: true, scaleLineStyle: "solid", scaleLineWidth: 2, scaleLineColor: "rgba(140,145,6,0.37)", scaleOverlay: false, scaleOverride: false, scaleSteps: 10, scaleStepWidth: 10, scaleStartValue: 0, inGraphDataShow: true, inGraphDataTmpl: '<%=v3%>', inGraphDataFontFamily: "'Indie Flower'", inGraphDataFontStyle: "normal bold", inGraphDataFontColor: "rgba(219,219,219,1)", inGraphDataFontSize: 15, inGraphDataPaddingX: 0, inGraphDataPaddingY: 5, inGraphDataAlign: "center", inGraphDataVAlign: "bottom", inGraphDataXPosition: 2, inGraphDataYPosition: 3, inGraphDataAnglePosition: 2, inGraphDataRadiusPosition: 2, inGraphDataRotate: 0, inGraphDataPaddingAngle: 0, inGraphDataPaddingRadius: 0, inGraphDataBorders: false, inGraphDataBordersXSpace: 1, inGraphDataBordersYSpace: 1, inGraphDataBordersWidth: 1, inGraphDataBordersStyle: "solid", inGraphDataBordersColor: "rgba(0,0,0,1)", legend: true, maxLegendCols: 5, legendBlockSize: 15, legendFillColor: 'rgba(255,255,255,0.00)', legendColorIndicatorStrokeWidth: 1, legendPosX: -2, legendPosY: 4, legendXPadding: 0, legendYPadding: 0, legendBorders: false, legendBordersWidth: 1, legendBordersStyle: "solid", legendBordersColors: "rgba(102,102,102,1)", legendBordersSpaceBefore: 5, legendBordersSpaceLeft: 5, legendBordersSpaceRight: 5, legendBordersSpaceAfter: 5, legendSpaceBeforeText: 5, legendSpaceLeftText: 5, legendSpaceRightText: 5, legendSpaceAfterText: 5, legendSpaceBetweenBoxAndText: 5, legendSpaceBetweenTextHorizontal: 5, legendSpaceBetweenTextVertical: 5, legendFontFamily: "'Indie Flower'", legendFontStyle: "normal normal", legendFontColor: "rgba(59,59,59,1)", legendFontSize: 21, yAxisFontFamily: "'Indie Flower'", yAxisFontStyle: "normal bold", yAxisFontColor: "rgba(102,102,102,1)", yAxisFontSize: 18, yAxisLabel: "Y Axis", yAxisUnitFontFamily: "'Indie Flower'", yAxisUnitFontStyle: "normal bold", yAxisUnitFontColor: "rgba(102,102,102,1)", yAxisUnitFontSize: 16, yAxisUnit: "Unit", showYAxisMin: false, rotateLabels: "smart", xAxisBottom: true, yAxisLeft: true, yAxisRight: false, graphTitleSpaceBefore: 5, graphTitleSpaceAfter: -2, graphTitleBorders: false, graphTitleBordersXSpace: 1, graphTitleBordersYSpace: 1, graphTitleBordersWidth: 1, graphTitleBordersStyle: "solid", graphTitleBordersColor: "rgba(0,0,0,1)", graphTitle: "Relatorio Semanal do Sistema", graphTitleFontFamily: "'Indie Flower'", graphTitleFontStyle: "normal normal", graphTitleFontColor: "rgba(140,145,6,1)", graphTitleFontSize: 32, scaleFontFamily: "'Indie Flower'", scaleFontStyle: "normal normal", scaleFontColor: "rgba(140,145,6,1)", scaleFontSize: 16, pointLabelFontFamily: "'Open Sans'", pointLabelFontStyle: "normal normal", pointLabelFontColor: "rgba(102,102,102,1)", pointLabelFontSize: 12, angleShowLineOut: true, angleLineStyle: "solid", angleLineWidth: 1, angleLineColor: "rgba(0,0,0,0.1)", percentageInnerCutout: 50, scaleShowGridLines: true, scaleGridLineStyle: "solid", scaleGridLineWidth: 1, scaleGridLineColor: "rgba(140,145,6,0.13)", scaleXGridLinesStep: 1, scaleYGridLinesStep: 0, segmentShowStroke: true, segmentStrokeStyle: "solid", segmentStrokeWidth: 2, segmentStrokeColor: "rgba(255,255,255,1.00)", datasetStroke: true, datasetFill: false, datasetStrokeStyle: "solid", datasetStrokeWidth: 2, bezierCurve: false, bezierCurveTension: 0.4, pointDotStrokeStyle: "solid", pointDotStrokeWidth: 1, pointDotRadius: 5, pointDot: true, scaleTickSizeBottom: 5, scaleTickSizeTop: 5, scaleTickSizeLeft: 5, scaleTickSizeRight: 5, barShowStroke: false, barBorderRadius: 0, barStrokeStyle: "solid", barStrokeWidth: 1, barValueSpacing: 15, barDatasetSpacing: 0, scaleShowLabelBackdrop: true, scaleBackdropColor: 'rgba(255,255,255,0.75)', scaleBackdropPaddingX: 2, scaleBackdropPaddingY: 2, animation: true, onAnimationComplete: function () {
                        MoreChartOptions()
                    }};
                DrawTheChart(ChartData, ChartOptions, "chart-01", "Line");</script>
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
    <!--<script src="js/listaCliente.js"></script>-->
</body>
</html>