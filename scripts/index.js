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

var app = angular.module('MyApp', ['ngMaterial', 'ngRoute', 'ngMessages', 'firebase', 'angular.filter', 'ngFileUpload', 'mailchimp', 'ngSanitize']);

app.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('light-green', {
            'default': '900'
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

app.controller("Maps", function($scope, $interval) {
       $scope.map = {
               center: {
                       latitude: 24.8087929,
                       longitude: 93.9306979
               },
               zoom: 8
       };
});

app.controller("base64Ctrl", function($scope, $firebaseArray) {
    var _validFileExtensions = [".jpg", ".jpeg", ".bmp", ".gif", ".png"];
    var activitiesRef = firebase.database().ref('activities');
    $scope.uploadFile = function() {
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
                                desc: $scope.description,
                                headline: $scope.headline
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

app.controller("LoginCtrl", ["$scope", "$firebaseAuth", "Upload", function($scope, $firebaseAuth, Upload) {
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

app.controller("VisionCtrl", function($scope, $firebaseObject) {

});

app.controller("AppCtrl", function($scope, $firebaseObject, $sce) {
    //volunter
    $firebaseObject(database.ref('contents/volunterUrl')).$loaded().then(function(data){
        $scope.url = $sce.trustAsResourceUrl(data.$value);
        //$scope.url = $sce.trustAsResourceUrl('https://docs.google.com/forms/d/e/1FAIpQLSeAdjRT7u67GonBBFm7sA9x2JbEkdnXrhVHlKUVoQjI6Pm3pg/viewform?c=0&w=1');
    });

    //about us
    $firebaseObject(database.ref('contents/aboutus')).$loaded().then(function(data){
        $scope.aboutus = data.$value;
    }).catch(function(error){
        console.error("error: " + error);
    });

    //vision
    $firebaseObject(database.ref('contents/vision')).$loaded().then(function(data){
        $scope.vision = data.$value;
    });

    //vision
    $firebaseObject(database.ref('contents/mission')).$loaded().then(function(data){
        $scope.mission = data.$value;
    });
    //sustainableagriculture
    $firebaseObject(database.ref('contents/sustainableagriculture')).$loaded().then(function(data){
        $scope.sustainableagricultureText = data.$value;
    });

    //medicinalaromaticplants
    $firebaseObject(database.ref('contents/medicinalaromaticplants')).$loaded().then(function(data){
        $scope.medicinalaromaticplantsText = data.$value;
    });
    //pamel
    $firebaseObject(database.ref('contents/pamel')).$loaded().then(function(data){
        $scope.pamelText = data.$value;
    });
    //internship
    $firebaseObject(database.ref('contents/internship')).$loaded().then(function(data){
        $scope.internshipText = data.$value;
    });
    //teams
    var dref = database.ref('teams/debkumari');
    dref.off();
    dref.once('value', function(snapshot) {
        var text = snapshot.val();
        $scope.debkumariText = snapshot.val();
        //console.log("Parsed HTML: "+$sce.trustAsHtml(snapshot.val()));
    });
    /* $firebaseObject(database.ref('teams/debkumari')).$loaded().then(function(data) {
         $scope.debkumariText = data.$value.tostring();
       }).catch(function(error) {console.error("Error:", error);});*/
    $firebaseObject(database.ref('teams/debchandra')).$loaded().then(function(data) {
        $scope.debchandraText = data.$value;
    }).catch(function(error) {
        console.error("Error:", error);
    });
    $firebaseObject(database.ref('teams/james')).$loaded().then(function(data) {
        $scope.jamesText = data.$value;
    }).catch(function(error) {
        console.error("Error:", error);
    });
    $firebaseObject(database.ref('teams/joy')).$loaded().then(function(data) {
        $scope.joyText = data.$value;
    }).catch(function(error) {
        console.error("Error:", error);
    });
    $firebaseObject(database.ref('teams/kunan')).$loaded().then(function(data) {
        $scope.kunanText = data.$value;
    }).catch(function(error) {
        console.error("Error:", error);
    });
    $firebaseObject(database.ref('teams/reuben')).$loaded().then(function(data) {
        $scope.reubenText = data.$value;
    }).catch(function(error) {
        console.error("Error:", error);
    });


    storage.ref('teamsimage/debkumari.jpg').getDownloadURL().then(function(url) {
        $scope.debkumariImg = url;
    }).catch(function(error) {
        console.log('Problem downloading teamsimage/debkumari.jpg')
    });
    storage.ref('teamsimage/debchandra.jpg').getDownloadURL().then(function(url) {
        $scope.debchandraImg = url;
    }).catch(function(error) {
        console.log('Problem downloading teamsimage/debchandra.jpg')
    });
    storage.ref('teamsimage/james.jpg').getDownloadURL().then(function(url) {
        $scope.jamesImg = url;
    }).catch(function(error) {
        console.log('Problem downloading teamsimage/james.jpg')
    });
    storage.ref('teamsimage/joy.jpg').getDownloadURL().then(function(url) {
        $scope.joyImg = url;
    }).catch(function(error) {
        console.log('Problem downloading teamsimage/joy.jpg')
    });
    storage.ref('teamsimage/kunan.jpg').getDownloadURL().then(function(url) {
        $scope.kunanImg = url;
    }).catch(function(error) {
        console.log('Problem downloading teamsimage/kunan.jpg')
    });
    storage.ref('teamsimage/reuben.jpg').getDownloadURL().then(function(url) {
        $scope.reubenImg = url;
    }).catch(function(error) {
        console.log('Problem downloading teamsimage/reuben.jpg')
    });
    storage.ref('teamsimage/sonia.jpg').getDownloadURL().then(function(url) {
        $scope.soniaImg = url;
    }).catch(function(error) {
        console.log('Problem downloading teamsimage/sonia.jpg')
    });
    storage.ref('teamsimage/subha.jpg').getDownloadURL().then(function(url) {
        $scope.subhaImg = url;
    }).catch(function(error) {
        console.log('Problem downloading teamsimage/subha.jpg')
    });

    //vision
    storage.ref('vision/vision1.jpg').getDownloadURL().then(function(url) {
        $scope.vision1Img = url;
    }).catch(function(error) {
        console.log('Problem downloading teamsimage/vision1.jpg')
    });
    storage.ref('vision/vision2.jpg').getDownloadURL().then(function(url) {
        $scope.vision2Img = url;
    }).catch(function(error) {
        console.log('Problem downloading teamsimage/vision2.jpg')
    });

    //what we do
    //Medicinal and Aromatic plants
    storage.ref('turmeric.jpg').getDownloadURL().then(function(url) {
        $scope.turmericImg = url;
    }).catch(function(error) {
        console.log('Problem downloading turmeric.jpg')
    });

    //pamel
    storage.ref('pamel.jpg').getDownloadURL().then(function(url) {
        $scope.pamelImg = url;
    }).catch(function(error) {
        console.log('Problem downloading pamel.jpg')
    });

    //organicfarming
    storage.ref('organicfarming2.jpg').getDownloadURL().then(function(url) {
        $scope.organicfarming2Img = url;
    }).catch(function(error) {
        console.log('Problem downloading organicfarming2.jpg')
    });
    $firebaseObject(database.ref('contents/organicfarming')).$loaded().then(function(data) {
        $scope.organicfarmingText = data.$value;
    }).catch(function(error) {
        console.error("Error:", error);
    });

    //traditional knowledge
    storage.ref('traditonalknowledge1.jpg').getDownloadURL().then(function(url) {
        $scope.traditonalknowledge1Img = url;
    }).catch(function(error) {
        console.log('Problem downloading traditonalknowledge1.jpg')
    });
    $firebaseObject(database.ref('contents/traditionalknowledge')).$loaded().then(function(data) {
        $scope.traditionalknowledgeText = data.$value;
    }).catch(function(error) {
        console.error("Error:", error);
    });

    //climate change
    storage.ref('loktakhomepage.jpg').getDownloadURL().then(function(url) {
        $scope.loktakhomepageImg = url;
    }).catch(function(error) {
        console.log('Problem downloading loktakhomepage.jpg')
    });
    storage.ref('djuko.jpg').getDownloadURL().then(function(url) {
        $scope.djukoImg = url;
    }).catch(function(error) {
        console.log('Problem downloading djuko.jpg')
    });
    storage.ref('nongleinungshit.jpg').getDownloadURL().then(function(url) {
        $scope.nongleinungshitImg = url;
    }).catch(function(error) {
        console.log('Problem downloading nongleinungshit.jpg')
    });
    $firebaseObject(database.ref('contents/climatechange')).$loaded().then(function(data) {
        $scope.climatechangeText = data.$value;
    }).catch(function(error) {
        console.error("Error:", error);
    });

    //herbal extraction
    $firebaseObject(database.ref('contents/herbalextraction')).$loaded().then(function(data) {
        $scope.herbalextractionText = data.$value;
    }).catch(function(error) {
        console.error("Error:", error);
    });

    //urbangardening
    $firebaseObject(database.ref('contents/urbangardening')).$loaded().then(function(data) {
        $scope.urbangardeningText = data.$value;
    }).catch(function(error) {
        console.error("Error:", error);
    });

});

app.controller("WhatWeDoCtrl", function($scope, $firebaseObject) {

});