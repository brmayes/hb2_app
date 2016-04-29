var app = angular.module('myApp', []);

  app.controller('BaseController', ['$http', '$scope', function($http, $scope) {

    this.message = "ready";

    $http.get('../data/hb2doc.txt')
    .success(function(data) {
        console.log(data);
        $scope.data = [{ text: data }];

    })
    .error(function(msg) {
        console.log("This request failed.\n" + msg);
    });

  }]);

  app.filter('highlight', function($sce) {
    return function(text, phrase) {

      if (phrase) {
        var regex = new RegExp('('+phrase+')', 'gi');
        var matches = regex.exec(text);
        if (matches !== null) {
          text = text.replace(regex,
          '<span class="highlighted">$1</span>');
        }
      }

      return $sce.trustAsHtml(text)
    }
  });
