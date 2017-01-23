var config = {
    apiKey: "AIzaSyArJPulXAY_nNQF-yeHRKfd5zhvAJtEkvA",
    authDomain: "midastouch2017.firebaseapp.com",
    databaseURL: "https://midastouch2017.firebaseio.com",
    storageBucket: "midastouch2017.appspot.com",
    messagingSenderId: "100584178804"
};
firebase.initializeApp(config);
var storage = firebase.storage();
var database = firebase.database();

var app = angular.module('MyApp', ['ngMaterial', 'ngRoute', 'ngMessages', 'firebase', 'angular.filter', 'ngFileUpload', 'mailchimp']);

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
            templateUrl: 'html/home.html'
        })
        .when('/home', {
            templateUrl: 'html/home.html'
        })
        .when('/whatwedo', {
            templateUrl: 'html/whatwedo.html'
        })
        .when('/getinvolved', {
            templateUrl: 'html/getinvolved.html'
        })
        .when('/gallery', {
            templateUrl: 'html/gallery.html'
        })
        .when('/contact', {
            templateUrl: 'html/contact.html'
        })
        .when('/donate', {
            templateUrl: 'html/donate.html'
        })
        .when('/admin', {
            templateUrl: 'html/admin.html'
        })
        .otherwise({
            templateUrl: 'html/sorry.html'
        });
});

app.controller("base64Ctrl", function($scope, $firebaseArray) {
    var _validFileExtensions = [".jpg", ".jpeg", ".bmp", ".gif", ".png"];
    var activitiesRef = firebase.database().ref('activities');
    $scope.uploadFile = function() {
        //var ref = firebase.database().ref('activities');
        $scope.activities = $firebaseArray(activitiesRef);
        var sFileName = document.getElementById("nameImg").value;
        if (sFileName.length > 0) {
            var blnValid = false;
            for (var j = 0; j < _validFileExtensions.length; j++) {
                var sCurExtension = _validFileExtensions[j];
                if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
                    blnValid = true;
                    var filesSelected = document.getElementById("nameImg").files;
                    if (filesSelected.length > 0) {
                        var fileToLoad = filesSelected[0];
                        var fileReader = new FileReader();
                        var time = firebase.database.ServerValue.TIMESTAMP;
                        console.log("time" + time);
                        fileReader.onload = function(fileLoadedEvent) {
                            var textAreaFileContents = document.getElementById(
                                "textAreaFileContents"
                            );
                            $scope.activities.$add({
                                date: time,
                                image: fileLoadedEvent.target.result,
                                desc: $scope.description
                            });
                        };
                        fileReader.readAsDataURL(fileToLoad);
                    }
                    break;
                }
            }
            if (!blnValid) {
                alert('File is not valid');
                return false;
            }
        }
        return true;
    }

    $scope.deleteActivity = function(actid) {
        var r = confirm("Do you want to remove this image ?");
        if (r == true) {
            $scope.activities.forEach(function(childSnapshot) {
                if (childSnapshot.$id == actid) {
                    $scope.activities.$remove(childSnapshot).then(function(ref) {
                        ref.key() === childSnapshot.$id; // true
                    });
                }
            });
        }
    }
});

app.controller("AppCtrl", ["$scope", "$firebaseAuth", "Upload", function($scope, $firebaseAuth, Upload) {
    $scope.imagePath = '../images/people.jpg';
    $scope.sorryImagePath = '../images/sorry.jpg';
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

app.controller("ActCtrl", function($scope, $firebaseArray) {
    var ref = firebase.database().ref('activities');
    $scope.activities = $firebaseArray(ref);
});

app.controller("TeamCtrl", function($scope, $firebaseObject) {
    var dref = database.ref('teams/debkumari');
    dref.off();
    dref.once('value', function(snapshot) {
        $scope.debkumariText = snapshot.val();
    });
   /* $firebaseObject(database.ref('teams/debkumari')).$loaded().then(function(data) {
        $scope.debkumariText = data.$value.tostring();
      }).catch(function(error) {console.error("Error:", error);});*/
    $firebaseObject(database.ref('teams/debchandra')).$loaded().then(function(data) {
        $scope.debchandraText = data.$value;
      }).catch(function(error) {console.error("Error:", error);});
    $firebaseObject(database.ref('teams/james')).$loaded().then(function(data) {
        $scope.jamesText = data.$value;
      }).catch(function(error) {console.error("Error:", error);});
    $firebaseObject(database.ref('teams/joy')).$loaded().then(function(data) {
        $scope.joyText = data.$value;
      }).catch(function(error) {console.error("Error:", error);});
    $firebaseObject(database.ref('teams/kunan')).$loaded().then(function(data) {
        $scope.kunanText = data.$value;
      }).catch(function(error) {console.error("Error:", error);});
    $firebaseObject(database.ref('teams/reuben')).$loaded().then(function(data) {
        $scope.reubenText = data.$value;
      }).catch(function(error) {console.error("Error:", error);});

    var storage = firebase.storage();
    storage.ref('teamsimage/debkumari.jpg').getDownloadURL().then(function(url) {
      $scope.debkumariImg = url;
    }).catch(function(error) {console.log('Problem downloading teamsimage/debkumari.jpg')});
    storage.ref('teamsimage/debchandra.jpg').getDownloadURL().then(function(url) {
      $scope.debchandraImg = url;
    }).catch(function(error) {console.log('Problem downloading teamsimage/debchandra.jpg')});
    storage.ref('teamsimage/james.jpg').getDownloadURL().then(function(url) {
      $scope.jamesImg = url;
    }).catch(function(error) {console.log('Problem downloading teamsimage/james.jpg')});
    storage.ref('teamsimage/joy.jpg').getDownloadURL().then(function(url) {
      $scope.joyImg = url;
    }).catch(function(error) {console.log('Problem downloading teamsimage/joy.jpg')});
    storage.ref('teamsimage/kunan.jpg').getDownloadURL().then(function(url) {
      $scope.kunanImg = url;
    }).catch(function(error) {console.log('Problem downloading teamsimage/kunan.jpg')});
    storage.ref('teamsimage/reuben.jpg').getDownloadURL().then(function(url) {
      $scope.reubenImg = url;
    }).catch(function(error) {console.log('Problem downloading teamsimage/reuben.jpg')});

});