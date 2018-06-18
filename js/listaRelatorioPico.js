function enviar() {
    var pessoa = {
        acao: 'listaPico',
        dataIni: cadastro.dataIni.value,
    };
    $.ajax({
        url: './middle/middleRelatorioPico.php',
        data: pessoa,
        method: "post",
        dataType: "json"
    }).done(function (ress) {
        var grafico = {};
        
        grafico.categories = ress.map((e) => { return e.hora + ":00" });
        grafico.series = ress.map((e) => { return parseInt(e.qtd) });
        
        exibirGrafico(grafico);
        console.log(grafico.series);
    }).fail(function (ress) {
        console.log(ress);
    });
}

function exibirGrafico (grfc) {
    Highcharts.chart('container', {
        chart: {
            type: 'line'
        },
        title: {
            text: 'Relatorio de Pico'
        },
        xAxis: {
            categories: grfc.categories
        },
        yAxis: {
            title: {
                text: 'Quantidade'
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
                name: 'Quantidade',
                data: grfc.series
            }]
    });
}