var DATABASE_VERSION = 0;
angular.module('starter')
.factory('SQLite_SERVICE', function($q, DB_CONFIG, $cordovaSQLite,$ionicPlatform) {
    var self = this;
    self.db = null;

    var baseQuery = function(query, bindings) {
        var deferred = $q.defer();
        if(window.cordova){
            $cordovaSQLite.execute(self.db, query, bindings).then(function(success){
                deferred.resolve(success);
            },function(error){
                deferred.reject(error);
            });
        }else{
        bindings = typeof bindings !== 'undefined' ? bindings : [];
        self.db.transaction(function(transaction) {
            transaction.executeSql(query, bindings, function(transaction, result) {
                deferred.resolve(result);
            }, function(transaction, error) {
                console.error("SQL Error - ",error);
                deferred.reject(error);
            });
        });
      }
      return deferred.promise;
    };

    var fetchAll = function(result) {
        var output = [];

        for (var i = 0; i < result.rows.length; i++) {
            output.push(result.rows.item(i));
        }

        return output;
    };

    var fetch = function(result) {
        return result.rows.item(0);
    };

    //Metodos de retorno

    self.init = function() {
        if(window.cordova){
          self.db =  window.sqlitePlugin.openDatabase({name:DB_CONFIG.name, location: 2});
        }else{
          self.db = window.openDatabase( DB_CONFIG.name, "1.0", "FMobile", -1);
        }
        angular.forEach(DB_CONFIG.tables, function(table) {
            var columns = [];
            angular.forEach(table.columns, function(column) {
                columns.push(column.name + ' ' + column.type);
            });
            var query = 'CREATE TABLE IF NOT EXISTS ' + table.name + ' (' + columns.join(',') + ')';
            baseQuery(query).then(function(result){console.log(result);},function(error){console.log(error);});
            console.log('Table ' + table.name + ' initialized');
        });

    };

    self.insertPerfil = function(perfil){
        if( typeof perfil.nickname != 'undefined' && typeof perfil.username != 'undefined' && typeof perfil.password != 'undefined' && typeof perfil.indice != 'undefined'){
            var columns = [];
            for(var i = 1; i < DB_CONFIG.tables[0].columns.length; i++ ) {
                columns.push(DB_CONFIG.tables[0].columns[i].name);
            };
            var query = "INSERT INTO "+DB_CONFIG.tables[0].name+"("+columns.join(',')+") VALUES (?,?,?,?)"
            return baseQuery(query,[perfil.nickname,perfil.username,perfil.password,perfil.indice]);
        }else{
            console.error("SQL - Insira um perfil com nickname,username,password e indice");
            return  null;
        }
    }

    self.updatePerfil = function(perfil){
        if( typeof perfil.id != 'undefined' && typeof perfil.nickname != 'undefined' && typeof perfil.username != 'undefined' && typeof perfil.password != 'undefined' && typeof perfil.indice != 'undefined'){
            if(perfil.id >= 0){
                var columns = [];
                var query = "UPDATE "+DB_CONFIG.tables[0].name+
                " SET "+DB_CONFIG.tables[0].columns[1].name+" = '"+perfil.nickname+"',"
                       +DB_CONFIG.tables[0].columns[2].name+" = '"+perfil.username+"',"
                       +DB_CONFIG.tables[0].columns[3].name+" = '"+perfil.password+"',"
                       +DB_CONFIG.tables[0].columns[4].name+" = "+perfil.indice+" WHERE "+DB_CONFIG.tables[0].columns[0].name+" = "+perfil.id;
                return baseQuery(query);
            }else{
                console.error("SQL - Insira um perfil com id valido");
            }
        }else{
            console.error("SQL - Insira um perfil com id,nickname,username,password e indice");
            return  null;
        }
    }

    self.deletePerfil = function(id){
        if( typeof id != 'undefined' && id != null){
            var columns = [];
            var query = "DELETE FROM "+DB_CONFIG.tables[0].name+" WHERE "+DB_CONFIG.tables[0].columns[0].name+" = "+id;
            return baseQuery(query);
        }else{
            console.error("SQL - Insira um ID");
            return  null;
        }
    }

    self.selectAllPerfil = function(){
        var deferred = $q.defer();
        var query =  "SELECT * FROM "+DB_CONFIG.tables[0].name ;
        baseQuery(query).then(function(success){
            deferred.resolve(fetchAll(success));
        }, function(error){
            deferred.reject(null);
        });
        return deferred.promise;
    }

    self.selectPerfilById = function(id){
        var deferred = $q.defer();
        var query =  "SELECT * FROM "+DB_CONFIG.tables[0].name+" WHERE id = "+id;
        baseQuery(query).then(function(success){
            deferred.resolve(fetch(success));
        }, function(error){
            deferred.reject(null);
        });
        return deferred.promise;
    }

    return self;
})
