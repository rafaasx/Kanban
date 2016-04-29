angular.module('ImportApp', [])
  .controller('ImportController', ['$scope', '$http', function ($scope, $http) {
      var importKanban = this;
      var applicationKey = 'ac79a551be09f12fd007b6b1173aa183';
      var applicationToken = '';
      importKanban.Kanban = {};
      importKanban.Kanban.cards = {};
      importKanban.TimeList = [];
      importKanban.QuadroList = [];
      importKanban.QuadroTimeList = [];
      importKanban.json = '';

      var authenticationSuccess = function () {
          console.log('Successful authentication');
      };
      var authenticationFailure = function () {
          console.log('Failed authentication');
      };



      importKanban.Importar = function () {
          try {
              importKanban.Kanban = {};
              Trello.authorize({
                  type: 'popup',
                  name: 'Method Informatica',
                  scope: {
                      read: true,
                      write: true
                  },
                  expiration: 'never',
                  success: authenticationSuccess,
                  error: authenticationFailure
              });
              applicationToken =  Trello.token()
              $http.get('https://api.trello.com/1/members/me/boards?&key=' + applicationKey + '&token=' + applicationToken)
              .success(function (data, status, headers, config) {
                  importKanban.QuadroList = data;
                  $http.get('https://api.trello.com/1/members/me/organizations?&key=' + applicationKey + '&token=' + applicationToken)
                  .success(function (data, status, headers, config) {
                      importKanban.TimeList = data;
                      for (i = 0; i < importKanban.TimeList.length; i++) {
                          for (j = 0; j < importKanban.QuadroList.length; j++) {
                              if (importKanban.QuadroList[j].closed == false) {
                                  $http.get('https://api.trello.com/1/boards/' + importKanban.QuadroList[i].id + '?actions=all&actions_limit=1000&card_attachment_fields=all&cards=all&lists=all&members=all&member_fields=all&card_attachment_fields=all&checklists=all&fields=all&key=' + applicationKey + '&token=' + applicationToken)
                                      .success(function(data, status, headers, config) {
                                          importKanban.Kanban.cards = data.cards;
                                      })
                                      .error(function(error, status, headers, config) {
                                          console.log(status);
                                          console.log(error);
                                          console.log(config.url);
                                      });
                              }
                          }
                      }
                  })
                  .error(function (error, status, headers, config) {
                      console.log(status);
                      console.log(error);
                      console.log("Error occured");
                  });
              })
              .error(function (error, status, headers, config) {
                  console.log(status);
                  console.log(error);
                  console.log("Error occured");
              });
          } catch (e) {
              console.log('erro: ' + e);
          }


      };

  }]);