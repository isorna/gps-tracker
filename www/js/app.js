// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.controller('TrackerCtrl', function($scope, $ionicLoading, $cordovaGeolocation) {
  var watch,
    duration = 30000,
    processing = false;

  $scope.toogleTracking = function () {
    if ($scope.isTracking) {
      startTracking();
    } else {
      endTracking();
    }
  };

  function startTracking () {
    //interval = window.setInterval(getLocation, duration);
    //getLocation();

    var watchOptions = {
      timeout : 3000,
      enableHighAccuracy: false // may cause errors if true
    };

    watch = $cordovaGeolocation.watchPosition(watchOptions);
    watch.then(null, function(err) {
      // error
    }, function(position) {
      $scope.position = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };

      if (!$scope.map) {
        createMap();
      } else {
        setMapCoords();
      }
    });

    console.log('GpsTracker service is tracking you now');
  }

  function endTracking () {
    //window.clearInterval(interval);
    $cordovaGeolocation.clearWatch(watch)
      .then(function(result) {
        // success
      }, function (error) {
        // error
      });
    console.log('GpsTracker service is not tracking you anymore');
  }
  /*
  function getLocation() {
    console.log('getLocation running');
    if (processing) return;

    $ionicLoading.show({
      template: 'Getting current location...',
      noBackdrop: true
    });

    processing = true;

    navigator.geolocation.getCurrentPosition(function(position) {
      processing = false;

      $scope.position = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };

      if (!$scope.map) {
        createMap();
      } else {
        setMapCoords();
      }

      console.log($scope.position, position);

      $ionicLoading.hide();
    }, function(error) {
      alert('Unable to get location: ' + error.message);
    });
  }*/

  function createMap () {
    var currentLatlng = new google.maps.LatLng($scope.position.latitude, $scope.position.longitude),
      mapOptions = {
        center: currentLatlng,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      },
      map = new google.maps.Map(document.getElementById("map"), mapOptions),
      marker = new google.maps.Marker({
        position: currentLatlng,
        map: map,
        title: 'You are here'
      });

    $scope.map = map;
  }

  function setMapCoords () {
    $scope.map.setCenter(new google.maps.LatLng($scope.position.latitude, $scope.position.longitude));
  }
})
.controller('DashCtrl', function($scope) {
  var deploy = new Ionic.Deploy();

  // Update app code with new release from Ionic Deploy
  $scope.doUpdate = function() {
    deploy.update().then(function(res) {
      console.log('Ionic Deploy: Update Success! ', res);
    }, function(err) {
      console.log('Ionic Deploy: Update error! ', err);
    }, function(prog) {
      console.log('Ionic Deploy: Progress... ', prog);
    });
  };

  // Check Ionic Deploy for new code
  $scope.checkForUpdates = function() {
    console.log('Ionic Deploy: Checking for updates');
    deploy.check().then(function(hasUpdate) {
      console.log('Ionic Deploy: Update available: ' + hasUpdate);
      $scope.hasUpdate = hasUpdate;
    }, function(err) {
      console.error('Ionic Deploy: Unable to check for updates', err);
    });
  }

})
