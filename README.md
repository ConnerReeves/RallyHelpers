RallyHelpers
============

A collection of helper classes which can be used to make common tasks performed by the Rally 2.0 SDK more easily achievable.

GridExporter
============

This helper class simplifies the task of exporting a ```rallygrid``` to excel.  It works in IE8+, Chrome, and FF.

By default, the GridExporter will grab the data in the each cell of the grid to create a file which will open in Excel. If you have a ```renderer``` defined for a column, it will use that instead.  However, if you want to have a custom renderer for what is exported to Excel, you can use a ```exportRenderer``` function.

######Examples:

Usage:
```
var gridExporter = Ext.create('GridExporter');    // create a new exporter
gridExporter.exportGrid(this.down('#myGrid')); // provide the id of the grid to export
```

Defining an ```exportRenderer``` :
```
xtype : 'rallygrid',
id    : 'mygrid',
...
columnCfgs : [{
    text     : 'Name',
    renderer : function(value, meta, record) {
        meta.tdCls = 'green';
        return value;
    },
    exportRenderer : function(record) {
        return '(' + record.get('Name') + ')'; // To put parents around the name when exported to Excel
    }
}
...
]
```

######Contributors:

* [Conner Reeves](https://github.com/ConnerReeves)
* [Tore Hanssen](https://github.com/thans)
