Ext.define('CustomApp.RecordHydrator', {
    config: {
        fields : []
    },

    constructor: function(config) {
        Ext.apply(this, config);
    },

    //Hydrates object fields based on OID returned by the LBAPI
    //recordsToHydrate may be a single array of records, or array of arrays (series)
    hydrate: function(recordsToHydrate) {
        var deferred = Ext.create('Deft.Deferred');
        
        Deft.Promise.all(_.map(this.fields, function(field) {
            return function() {
                var deferred = Ext.create('Deft.Deferred');
                
                //Create hydration map using OIDs from records to create filters
                //Separate filters into groups of 100
                var filterSets = _.values(_.groupBy(_.map(_.unique(_.map(_.flatten(recordsToHydrate), function(record) {
                    return record.get(field.name);
                })), function(OID) {
                    return {
                        property : 'ObjectID',
                        value    : OID
                    };
                }), function(filter, key) {
                    return Math.floor(key / 100);
                }));

                Deft.Promise.all(_.map(filterSets, function(filter) {
                    return function() {
                        var deferred = Ext.create('Deft.Deferred');
                        Ext.create('Rally.data.WsapiDataStore', {
                            limit   : Infinity,
                            model   : field.name.replace('Feature', 'PortfolioItem/Feature'),
                            fetch   : field.hydrate,
                            filters : Rally.data.QueryFilter.or(filter)
                        }).load({
                            callback: function(records) {
                                deferred.resolve(records);
                            }
                        });
                        return deferred.promise;
                    }();                 
                })).then({
                    success: function(hydrationRecordSets) {
                        //Create the hydration map (OID -> record)
                        var hydrationMap = Ext.create('Ext.util.HashMap');
                        _.each(_.flatten(hydrationRecordSets), function(record) {
                            hydrationMap.add(record.get('ObjectID'), record);
                        });

                        //Apply hydrated field value to each record
                        _.each(recordsToHydrate, function(record) {
                            //If there is a subarray (series of record sets), hydrate individual records from each.
                            if (_.isArray(record)) {
                                _.each(record, function(subRecord) {
                                    subRecord.set(field.name, hydrationMap.get(subRecord.get(field.name)));
                                });
                            } else { //Otherwise populate the record as usual
                                record.set(field.name, hydrationMap.get(record.get(field.name)));
                            }
                        });

                        deferred.resolve();
                    }
                });
                return deferred.promise;
            }();
        })).then({
            success: function() {
                deferred.resolve(recordsToHydrate);
            }
        });
        
        return deferred.promise;
    }
});
