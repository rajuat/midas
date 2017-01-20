var config = {
    apiKey: "AIzaSyArJPulXAY_nNQF-yeHRKfd5zhvAJtEkvA",
    authDomain: "midastouch2017.firebaseapp.com",
    databaseURL: "https://midastouch2017.firebaseio.com",
    storageBucket: "midastouch2017.appspot.com",
    messagingSenderId: "100584178804"
};
firebase.initializeApp(config);

var app = angular.module('MyApp', ['ngMaterial', 'ngRoute', 'ngMessages', 'firebase']);

app.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('teal', {
            'default': '500',
            'hue-1': '100',
            'hue-2': '600',
            'hue-3': 'A100'
        })
        .accentPalette('lime', {
            'default': '200'
    });
});

app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'html/about.html'
        })
        .when('/about', {
            templateUrl: 'html/about.html'
        })
        .when('/activities', {
            templateUrl: 'html/activities.html'
        })
        .when('/contact', {
            templateUrl: 'html/contact.html'
        })
        .otherwise({
            template: 'Page Not Found!'
        });
});
