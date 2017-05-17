class Grafica{
    constructor(){
        this.functionsList = new Array();
    }
    
    addfunction(fName, fList){
        this.functionsList[fName] = fList;
    }
    
    makeChart(chart){
        var cols = [];
        for(var key in this.functionsList){
            cols.push([key].concat(this.functionsList[key]));    
        }
        
        var chart = c3.generate({
            bindto: chart,
            size: {
                height: 240,
                width: 480
            },
            data: {
              columns: cols
            },
            axis: {
                x: {
                    type: 'category',
                    categories: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP',  'OCT',  'NOV',  'DIC']
                }
            }
        });
        
    }
}