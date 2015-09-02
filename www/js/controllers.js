angular.module('starter')
.controller('AppCtrl',function($scope, SQLite_SERVICE, $ionicPlatform, $ionicPopup){

    function defaultSettings() {
        $scope.cadastroAtivo = true;
        $scope.perfilAtual = {
            id: null,
            nickname: "",
            username: "",
            password: "",
            indice: ""
        }
    };

    defaultSettings();

    function refreshPerfis(){
        SQLite_SERVICE.selectAllPerfil().then(function(success){
            $scope.perfis = success;
            console.log($scope.perfis);
        },function(error){
            $scope.perfis = [];
        });
    }

    $ionicPlatform.ready(function(){
        refreshPerfis();
    })

    $scope.botaoCadastrar = function(perfil){
        SQLite_SERVICE.insertPerfil(perfil).then(function(success){
            $ionicPopup.alert({
              title: 'Exemplo SQLite',
              template: 'Cadastro concluido com sucesso!'
            });
            refreshPerfis();
            defaultSettings();
        },function(error){
            $ionicPopup.alert({
              title: 'Exemplo SQLite',
              template: 'Houve um Erro no cadastro!'
            });
        });
    }

    $scope.botaoEditar = function(perfil){
        SQLite_SERVICE.updatePerfil(perfil).then(function(success){
            $ionicPopup.alert({
              title: 'Exemplo SQLite',
              template: 'Perfil Atualizado com Sucesso!'
            });
            refreshPerfis();
            defaultSettings();
        },function(error){
            $ionicPopup.alert({
              title: 'Exemplo SQLite',
              template: 'Houve um Erro na atualização!'
            });
        })
    }

    $scope.deletarPerfil = function(id){
           $ionicPopup.confirm({
             title: 'Exemplo SQLite',
             template: ' Deseja Realmente deletar este perfil? '
           }).then(function(res) {
             if(res) {
                 SQLite_SERVICE.deletePerfil(id).then(function(success){
                     $ionicPopup.alert({
                       title: 'Exemplo SQLite',
                       template: 'Perfil Deletado com Sucesso!'
                     });
                     refreshPerfis();
                     defaultSettings();
                 }, function(error){
                     console.error("SQL -",error);
                     $ionicPopup.alert({
                       title: 'Exemplo SQLite',
                       template: 'Houve um Erro ao deletar!'
                     });
                 })
             } else {

             }
           });
    }

    $scope.selectToEdit = function(perfil){
        $scope.cadastroAtivo = false;
        $scope.perfilAtual = perfil;
    }

    $scope.cancelEdit = function(){
        defaultSettings();
    }

    $scope.refreshButton = function(){
        refreshPerfis();
    }
})
