Ext.define('GridExporter', {
    exportGrid: function(grid) {
        var gridHTMLTable = '<table>';
        //Table Headers
        gridHTMLTable += '<tr>';
        Ext.Array.each(grid.columns, function(col) {
            if (!col.hidden && Ext.isIE) {
                gridHTMLTable += '<td>' + ('' + col.text) + '</td>';
            } else if(!col.hidden) {
                gridHTMLTable += '<td>' + ('' + col.text).replace(/ /g, '%20') + '</td>';
            }
        });
        gridHTMLTable += '</tr>';
        //Table Rows
        grid.store.each(function(record) {
            gridHTMLTable += '<tr>';
            Ext.Array.each(grid.columns, function(col, colIdx) {
                if (!col.hidden) {
                    var renderedColumnText = (grid.columnCfgs[colIdx].exportRenderer !== undefined) ?
                                              grid.columnCfgs[colIdx].exportRenderer(record) :
                                             (grid.columnCfgs[colIdx].renderer !== undefined) ?
                                              grid.columnCfgs[colIdx].renderer('','',record) : record.get(col.dataIndex);
                    if (Ext.isIE) {
                      gridHTMLTable += '<td>' + (('' + renderedColumnText)) + '</td>';
                    } else {
                      gridHTMLTable += '<td>' + encodeURIComponent(('' + renderedColumnText)) + '</td>';
                    }
                }
            });
            gridHTMLTable += '</tr>';
        });
        gridHTMLTable += '</table>';

        if (Ext.isIE) {
           window.clipboardData.setData("Text", gridHTMLTable);
           var objExcel     = new ActiveXObject ("Excel.Application");
           objExcel.visible = true;
           var objWorkbook  = objExcel.Workbooks.Add;
           var objWorksheet = objWorkbook.Worksheets(1);
           objWorksheet.Paste();
           objExcel.visible = true;
        } else {
            window.open('data:application/vnd.ms-excel,' + gridHTMLTable);
        }
    }
});