'use strict';

angular.module('myApp', ['ui.router']).config(["$urlRouterProvider", "$stateProvider", function ($urlRouterProvider, $stateProvider) {

    $stateProvider.state('movieSearch', {
        url: '/',
        templateUrl: './app/routes/movieSearch/movieSearch.html',
        controller: 'movieSearchCtrl'
    }).state('specificMovie', {
        url: '/info',
        templateUrl: './app/routes/specificMovie/specificMovie.html',
        controller: 'specificMovieCtrl'
    }).state('movieQuotes', {
        url: '/quotes',
        templateUrl: './app/routes/quotes/quotes.html',
        controller: 'quotesCtrl'
    }).state('about', {
        url: '/about',
        templateUrl: './app/routes/about/about.html',
        controller: 'aboutCtrl'
    });

    $urlRouterProvider.otherwise('/');
}]);
'use strict';

$(document).ready(function () {

    var $box = $('#box');

    $box.mouseenter(function () {
        var randX = Math.floor(Math.random() * 20 + 1);
        var randY = Math.floor(Math.random() * 800 + 1);

        TweenLite.to($box, 1, { left: randX, x: 0, top: randY });
    });

    $box.click(function () {
        var randX = Math.floor(Math.random() * 600 + 1);
        var randY = Math.floor(Math.random() * 200 + 1);

        $box.text('Not This Time Sucka!');
        TweenLite.to($box, 1, { left: randX, top: randY });
        setTimeout(function () {
            $box.text('Leave Neg Feedback');
        }, 1500);
    });
});
'use strict';

angular.module('myApp').controller('mainCtrl', ["$scope", "movieService", function ($scope, movieService) {

  $scope.mobileMenu = false;

  $scope.showMobileMenu = function () {
    $scope.mobileMenu = !$scope.mobileMenu;
  };
}]);
'use strict';

angular.module('myApp').service('movieService', ["$http", function ($http) {

    this.searchMovie = function (movie_name) {
        var search = movie_name.split(' ').join('+');
        return $http.get('https://www.omdbapi.com/?s=' + search);
    };

    this.showSpecificMovie = function (movie_name) {
        var search = movie_name.split(' ').join('+');
        return $http.get('https://www.omdbapi.com/?t=' + search);
    };
}]);
'use strict';

angular.module('myApp').directive('highlightDir', function () {

    return {
        restrict: 'A',
        link: function link(scope, elem, atts) {
            elem.click(function () {
                elem.toggleClass('yellow');
            });
        }
    };
});
'use strict';

angular.module('myApp').controller('aboutCtrl', ["$scope", "aboutService", function ($scope, aboutService) {

    $scope.techInfo = '';
    $scope.showTechBox = false;

    $scope.exitTechBox = function () {
        $scope.showTechBox = !$scope.showTechBox;
    };

    $scope.getTech = function (tech) {
        $scope.showTechBox = true;
        $scope.techInfo = aboutService.getTech(tech);
    };
}]);
'use strict';

angular.module('myApp').service('aboutService', function () {

    var techList = {
        responsive: 'Responsive designs fit multiple screen sizes, adjusting automatically to phones, tablets, desktops, and even rotation of screens.',
        gulp: 'Gulp is a toolkit that automates time-consuming tasks in the development workflow, such as script linking and css pre-processing with Sass/Scss.',
        scss: 'Scss is a css pre-processor that allows nested css declarations and variable declarations.',
        babel: 'Babel js is a compiler that helps translate newer Javascript code into older, browser compatible versions.',
        animations: 'Css animations let an element gradually change from one style to another. **Css Animations were used on my navigation bar, both for the mobile-nav and the desktop-nav.',
        html: 'HTML is the basic language of the internet.',
        js: 'Javascript is the programming language used to create interactive effects within the website. **ES6 arrow functions were used consistently throughout the website.',
        angular: 'Angular js is the structural framework used to make the website dynamic more simply than by using javascript by itself.',
        api: 'An API call accesses data from a server somewhere on the internet. **Both of the movie search pages and the daily quote page all use an API.',
        routing: 'UI-Routing allows for multiple views in a single page application(SPA). Instead of loading a new page each time you use the navigation bar, the view itself changes.',
        directive: 'Custom Angular directives extend the functionality of plain HTML. **The home page search results use a custom Angular directive that highlights any movie you click on.'
    };

    this.getTech = function (tech) {
        return techList[tech];
    };
});
'use strict';

angular.module('myApp').controller('movieSearchCtrl', ["$scope", "movieService", function ($scope, movieService) {

  $scope.hasContent = false;
  $scope.error = false;

  $scope.searchMovie = function (movie_name) {
    movieService.searchMovie(movie_name).then(function (response) {
      if (response.data.Response === "True") {
        $scope.movies = response.data.Search;
        $scope.hasContent = true;
        $scope.error = false;
      } else {
        $scope.movies = [{
          Title: 'no movies found by this title. Your search may have an error/typo, please try again.',
          Year: "Error"
        }];
        $scope.hasContent = true;
        $scope.error = true;
      }
      $scope.movie_name = '';
    });
  };
}]);
'use strict';

angular.module('myApp').controller('quotesCtrl', ["$scope", "quotesService", function ($scope, quotesService) {

    $scope.getQuote = function () {
        quotesService.getQuote().then(function (response) {
            var res = response.data.contents.quotes[0];
            $scope.quote = res.quote;
            $scope.author = res.author;
            $scope.copyright = response.data.contents.copyright;
        });
    };

    $scope.getQuote();
}]);
'use strict';

angular.module('myApp').service('quotesService', ["$http", function ($http) {

    this.getQuote = function () {
        return $http.get('https://quotes.rest/qod.json');
    };
}]);
'use strict';

angular.module('myApp').controller('specificMovieCtrl', ["$scope", "movieService", function ($scope, movieService) {

    $scope.movieHasBeenSearched = false;

    $scope.showSpecificMovie = function (movie_name) {

        movieService.showSpecificMovie(movie_name).then(function (response) {
            $scope.title = response.data.Title;
            $scope.rating = response.data.Rated;
            $scope.runtime = response.data.Runtime;
            $scope.revenue = response.data.BoxOffice;
            $scope.reviewRating = response.data.imdbRating;
            $scope.searchByName = '';
            $scope.movieHasBeenSearched = true;
        });
    };
}]);