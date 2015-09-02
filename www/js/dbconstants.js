angular.module("starter").constant('DB_CONFIG', {
    name: 'TesteSQLite_Database',
    tables: [
      {
            name: 'Usuarios',
            columns: [
                {name: 'id', type: 'integer primary key autoincrement'},
                {name: 'nickname', type:'text'},
                {name: 'username', type: 'text'},
                {name: 'password', type: 'text'},
                {name: 'indice', type: 'integer'}
            ]
        }
    ]
});
