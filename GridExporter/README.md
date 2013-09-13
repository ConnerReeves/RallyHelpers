Rally Grid Exporter
===================

This helper class simplifies the task of exporting a ```rallygrid``` to Excel.  It has been tested in IE8+, Chrome, and FF.

By default, the GridExporter will grab the data in the each cell of the grid to create a file which will open in Excel. If you have a ```renderer``` defined for a column, it will use that instead.  However, if you want to have a custom renderer for what is exported to Excel, you can use a ```exportRenderer``` function.

######Examples:

Usage:
```
var gridExporter = Ext.create('GridExporter'); // create a new exporter
gridExporter.exportGrid(this.down('#myGrid')); // provide the id of the grid to export
```

Defining an ```exportRenderer``` :
```
xtype : 'rallygrid',
id    : 'mygrid',
...
columnCfgs : [{
    text     : 'Name',
    exportRenderer : function(record) {
        return '(' + record.get('Name') + ')'; // To put parens around the name when exported to Excel
    }
}
...
]
```


Note: if you use the value parameter to the render function (the first param to the renderer function), you must supply an exportRenderer or rewrite the renderer only using the third parameter to the renderer function (the record) in order for the GridExporter to work.
