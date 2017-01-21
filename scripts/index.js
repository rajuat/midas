var config = {
    apiKey: "AIzaSyArJPulXAY_nNQF-yeHRKfd5zhvAJtEkvA",
    authDomain: "midastouch2017.firebaseapp.com",
    databaseURL: "https://midastouch2017.firebaseio.com",
    storageBucket: "midastouch2017.appspot.com",
    messagingSenderId: "100584178804"
};
firebase.initializeApp(config);
var storage = firebase.storage();

var app = angular.module('MyApp', ['ngMaterial', 'ngRoute', 'ngMessages', 'firebase', 'ngFileUpload']);

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
        .when('/admin', {
            templateUrl: 'html/admin.html'
        })
        .otherwise({
            template: 'Page Not Found!'
        });
});


app.directive('chooseFile', function() {
    return {
        link: function(scope, elem, attrs) {
            var button = elem.find('button');
            var input = angular.element(elem[0].querySelector('input#fileInput'));

            button.bind('click', function() {
                input[0].click();
            });

            input.bind('change', function(e) {
                scope.$apply(function() {
                    var files = e.target.files;
                    if (files[0]) {
                        scope.fileName = files[0].name;
                        scope.file = files[0];
                    } else {
                        scope.fileName = null;
                    }
                });
            });
        }
    };
});


app.controller("AppCtrl", ["$scope", "$firebaseAuth", "Upload", function($scope, $firebaseAuth, Upload) {
    $scope.imagePath = '../images/logo.jpg';

        $scope.addPost = function(files) {
        console.log("in addpost" + files);
                var fb = firebase.database().ref('images');
        console.log("in fb" + fb);
                var images = Upload.base64DataUrl(files).then(function(base64Urls){
                    console.log('image' + base64Urls);
                    fb.push({
                        images : base64Urls
                    },function(error) {
                        if (error) {
                            console.log("Error:",error);
                        } else {
                            console.log("Post set successfully!");
                            console.log(images);
                            $scope.$apply();
                        }
                    });
                });
        }

    $scope.upload = function(file) {
        var metadata = {
            contentType: 'image/jpeg',
        };
        var storageRef = storage.ref();
        var imageFolderRef = storageRef.child('images');
        var imageRef = imageFolderRef.child('abc.jpg');
        var bytes = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x2c, 0x20, 0x77, 0x6f, 0x72, 0x6c, 0x64, 0x21]);
        var uploadTask = imageRef.put(file, metadata).then(function() {
            console.log('File uploaded');
        });

        uploadTask.on('state_changed', function(snapshot) {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
            }
        }, function(error) {
            switch (snapshot.state) {
                case 'storage/unauthorized':
                    console.log('Error in upload - permission');
                    break;
                case 'storage/canceled':
                    console.log('Error in upload - user canceled');
                    break;
                case 'storage/unknown':
                    console.log('Error in upload');
                    break;
            }
        }, function() {
            var url = uploadTask.snapshot.downloadURL;
        })
    }


    $scope.authObj = $firebaseAuth();
    $scope.signin = function() {
        $scope.authObj.$signInWithPopup("google").then(function(authData) {
            $scope.userInfo = authData;
            console.log("Signin in as:", authData);
        }).catch(function(error) {
            $scope.userInfo = undefined;
            console.error("Signin failed:", error);
        });
    };

    $scope.authObj.$onAuthStateChanged(function(authData) {
        if (authData) {
            $scope.userInfo = authData;
            console.log("AuthData in as:", authData);
        } else {
            $scope.userInfo = undefined;
            console.log("AuthData out");
        }
    });

    $scope.signout = function() {
        firebase.auth().signOut().then(function() {
            $scope.authData = undefined;
            $scope.$apply();
        }, function() {
            console.log("Error while signing out!");
        });
    };

}]);