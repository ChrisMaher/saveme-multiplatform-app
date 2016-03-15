angular.module('starter.controllers', ['textAngular'])

  .controller('AppCtrl', function ($http, $scope, $ionicModal, $timeout, $stateParams, $state, $cookieStore, $window, $ionicPopup, $localStorage, $sessionStorage) {


    $scope.buttonColour = function (votes) {
      if (votes < 0)
        return "blue";
      else if (votes >= 1 && votes <= 25)
        return "grey";
      else if (votes >= 26 && votes <= 50)
        return "yellow";
      else if (votes >= 51 && votes <= 99)
        return "orange";
      else if (votes >=100)
        return "red";


    };

    // Logout user
    $scope.logout = function () {
      $scope.storage.$reset();
      $state.go('app.savings');
      $window.location.reload();
    };

    $scope.storage = $localStorage;


    $scope.user = $cookieStore.get('userInfo');

    // Form data for the login modal
    $scope.loginData = {};
    $scope.signupData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    // Create the signup modal that we will use later
    $ionicModal.fromTemplateUrl('templates/signup.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modalsignup = modal;
    });

    // Create the signup modal that we will use later
    $ionicModal.fromTemplateUrl('templates/profile.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modalprofile = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
      $scope.modal.hide();
    };

    // Triggered in the login modal to close it
    $scope.closeSignup = function () {
      $scope.modalsignup.hide();
    };

    // Triggered in the login modal to close it
    $scope.closeProfile = function () {

      $timeout(function () {
        $scope.modalprofile.hide();
      }, 500);
    };

    // Open the login modal
    $scope.login = function () {

      $scope.modalsignup.hide();
      $scope.modalprofile.hide();

      $timeout(function () {
        $scope.modal.show();
      }, 500);


    };

    // Open the login modal
    $scope.profile = function () {


      $scope.modalsignup.hide();
      $scope.modal.hide();

      $timeout(function () {
        $scope.modalprofile.show();
      }, 500);

    };

    // Open the signup modal
    $scope.signup = function () {

      $scope.modalprofile.hide();
      $scope.modal.hide();

      $timeout(function () {
        $scope.modalsignup.show();
      }, 500);


    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {

      // console.log('Doing login', $scope.loginData);
      // alert('Doing login');

      $scope.data = {};
      $scope.data.username = $scope.loginData.username;
      $scope.data.password = $scope.loginData.password;

      // http://www.saveme.ie/api/auth/signin


      $timeout(function () {

        $http.post("http://www.saveme.ie/api/auth/signin", $scope.data).success(function (data1, status) {
          $scope.hello = data1;

          console.log($scope.hello);

          $scope.storage.username = $scope.hello.username;
          $scope.storage.email = $scope.hello.email;
          $scope.storage.provider = 'local';
          $scope.storage.gender = $scope.hello.gender;
          $scope.storage._id = $scope.hello._id;
          $scope.storage.profilePic = $scope.hello.profileImageURL;
          $scope.storage.created = $scope.hello.created;
          $scope.storage.county = $scope.hello.county;

          $scope.storage.aboutme = $scope.hello.aboutme;

          if ($scope.hello.profileImageURL.substring(0, 3) === 'mod') {
            $scope.storage.profilePic = 'http://www.saveme.ie/' + $scope.hello.profileImageURL;
          } else if ($scope.hello.profileImageURL.substring(0, 6) === '../mod') {
            $scope.storage.profilePic = 'http://www.saveme.ie/' + $scope.storage.profilePic.substring(3);
          }

          $scope.modal.hide();
          $scope.modalsignup.hide();
          // $window.location.reload();

        }).error(function (data, status, header, config) {

          $ionicPopup.alert({
            title: 'Login Failed.'
          });

        });

      }, 1000);
    };

    // Perform the signup action when the user submits the signup form
    $scope.doSignup = function () {

      // console.log('Doing login', $scope.loginData);
      // alert('Doing Signup');

      $scope.data = {};
      $scope.data.firstName = $scope.signupData.signupFirstName;
      $scope.data.lastName = $scope.signupData.signupSurname;
      $scope.data.email = $scope.signupData.signupEmail;
      $scope.data.username = $scope.signupData.signupUsername;
      $scope.data.password = $scope.signupData.signupPassword;
      // $scope.data.password2 = $scope.signupData.signupPassword2;

      // http://www.saveme.ie/api/auth/signin


      $timeout(function () {

        $http.post("http://www.saveme.ie/api/auth/signup", $scope.data).success(function (data1, status) {
          $scope.hello = data1;

          $scope.loginData.username = $scope.hello.username;
          $scope.loginData.password = $scope.signupData.signupPassword;


          $scope.doLogin();

          $timeout(function () {
            $scope.modalsignup.hide();
          }, 1000);

        }).error(function (data, status, header, config) {

          $ionicPopup.alert({
            title: 'Signup Incorrect'
          });

        });

      }, 1000);
    };


    /**
     * SOCIAL LOGIN
     * Facebook and Google
     */
      // FB Login
    $scope.fbLogin = function () {
      FB.login(function (response) {
        if (response.authResponse) {
          getUserInfo();
        } else {
          console.log('User cancelled login or did not fully authorize.');
        }
      }, {scope: 'email,user_photos,user_videos'});

      function getUserInfo() {
        // get basic info
        FB.api('/me', function (response) {
          console.log('Facebook Login RESPONSE: ' + angular.toJson(response));
          // get profile picture
          FB.api('/me/picture?type=normal', function (picResponse) {
            console.log('Facebook Login RESPONSE: ' + picResponse.data.url);
            response.imageUrl = picResponse.data.url;
            // store data to DB - Call to API
            // Todo
            // After posting user data to server successfully store user data locally
            var user = {};
            user.name = response.name;
            user.email = response.email;
            user.provider = 'facebook';
            if (response.gender) {
              response.gender.toString().toLowerCase() === 'male' ? user.gender = 'M' : user.gender = 'F';
            } else {
              user.gender = '';
            }
            user.profilePic = picResponse.data.url;
            $cookieStore.put('userInfo', user);
            $scope.modal.hide();
            $window.location.reload();
          });
        });
      }
    };
    // END FB Login

    $http.get('http://www.saveme.ie/api/savings').success(function (dataProfile) {
      $scope.savingsProfile = dataProfile;

      $scope.savingsCountTotal = 0;
      for (i = 0; i < $scope.savingsProfile.length; i++) {

        if ($scope.savingsProfile[i].user._id === $scope.storage._id) {

          $scope.savingsCountTotal++;
        }
      }

    });
    $http.get('http://www.saveme.ie/savings/usersSavingsPostedTotal/' + $scope.storage._id).success(function (dataProfile) {
      $scope.savingsByUser = dataProfile;
      $scope.totalUpvotes = 0;
      $scope.totalDownvotes = 0;

      for (var i = 0; i < $scope.savingsByUser.length; i++) {

        $scope.totalUpvotes = $scope.totalUpvotes + $scope.savingsByUser[i].upVoters.length;
      }

      for (var x = 0; x < $scope.savingsByUser.length; x++) {

        $scope.totalDownvotes = $scope.totalDownvotes + $scope.savingsByUser[x].downVoters.length;
      }
    });

    $scope.refreshProfile = function () {

      $http.get('http://www.saveme.ie/api/savings').success(function (dataProfile) {
        $scope.savingsProfile = dataProfile;
        $scope.idFilter = $scope.storage._id;


      });

      $timeout(function () {

        //Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');

      }, 1000);
    };

    $scope.productImage = function (saving) {

      var savingURL = saving.urlimage.charAt(0);
      // console.log(savingURL);

      if (savingURL === '.') {

        while (saving.urlimage.charAt(0) === '0')
          saving.urlimage = saving.urlimage.substr(1);

        // console.log('http://www.saveme.ie/'+ saving.urlimage);

        return 'http://www.saveme.ie/' + saving.urlimage;


      } else {

        return saving.urlimage;

      }


    };
  })


  .controller('SavingsCtrl', function ($http, $scope, $window, $timeout, $cookieStore) {

    $scope.user = $cookieStore.get('userInfo');
    // console.log($scope.user);

    $scope.openSaving = function (saving) {

      $window.open(saving.link);


    };

    $http.get('http://www.saveme.ie/api/savings').success(function (data) {
      $scope.savings = data;

    });


    $scope.refresh = function () {

      $http.get('http://www.saveme.ie/api/savings').success(function (data) {
        $scope.savings = data;

      });

      $timeout(function () {

        //Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');

      }, 1000);
    };

    $scope.productImage = function (saving) {

      var savingURL = saving.urlimage.charAt(0);
      // console.log(savingURL);

      if (savingURL === '.') {

        while (saving.urlimage.charAt(0) === '0')
          saving.urlimage = saving.urlimage.substr(1);

        // console.log('http://www.saveme.ie/'+ saving.urlimage);

        return 'http://www.saveme.ie/' + saving.urlimage;


      } else {

        return saving.urlimage;

      }


    };

    $scope.userImage = function (saving) {

      var cut = '';
      var userImageURL = '';


      if(saving.user.profileImageURL !== undefined){

        userImageURL = saving.user.profileImageURL.charAt(0);


        if (userImageURL === '.') {

          cut  = saving.user.profileImageURL.substring(3);

          console.log('http://www.saveme.ie/' + cut);
          return 'http://www.saveme.ie/' + cut;


        }else if(userImageURL === 'm'){


          return 'http://www.saveme.ie/' + saving.user.profileImageURL;

        }else{


          return saving.user.profileImageURL;

        }
      }




    };






  })

  .controller('SavingCtrl', function ($stateParams, $scope, $http, $cookieStore, $timeout) {

    // $scope.savingUrl = function (saving) {
    //
    //   $scope.savingLink = 'http://saveme.ie/savings/' + $scope.saving._id;
    //   // console.log($scope.savingLink);
    //   return $scope.savingLink;
    //
    // };

    // $scope.votedCold = true;
    // $scope.votedHot = true;

    $scope.userImage = function (saving) {

      var cut = '';
      var userImageURL = '';

      console.log("userImageURL " + userImageURL);

      if(saving.user.profileImageURL !== undefined){

        userImageURL = saving.user.profileImageURL.charAt(0);

        console.log("userImageURL " + userImageURL);

        if (userImageURL === '.') {

         cut  = saving.user.profileImageURL.substring(3);

          console.log('http://www.saveme.ie/' + cut);
          return 'http://www.saveme.ie/' + cut;

        }else if(userImageURL === 'm'){

          console.log("userImageURL " + userImageURL);

          return 'http://www.saveme.ie/' + saving.user.profileImageURL;

        }else{

          console.log("userImageURL " + userImageURL);

          return saving.user.profileImageURL;

        }
      }




    };

    $scope.user = $cookieStore.get('userInfo');

    $scope.productImage = function (saving) {

      var savingURL = saving.urlimage.charAt(0);
      // console.log(savingURL);

      if (savingURL === '.') {

        while (saving.urlimage.charAt(0) === '0')
          saving.urlimage = saving.urlimage.substr(1);

        // console.log('http://www.saveme.ie/'+ saving.urlimage);

        return 'http://www.saveme.ie/' + saving.urlimage;


      } else {

        return saving.urlimage;

      }


    };

    $scope.id = $stateParams.savingId;

    $http.get('http://www.saveme.ie/api/savings/' + $scope.id).success(function (data) {
      $scope.saving = data;
      $scope.priceFormatted = '€' + $scope.saving.price;
      $scope.retailerFormatted = '@ (' + $scope.saving.retailer + ')';
      $scope.savingLink = 'http://saveme.ie/savings/' + $scope.saving._id;

      var hasVoted = $scope.saving.downVoters.filter(function (voter) {

          return voter === $scope.storage.email;

        }).length > 0;


      if (hasVoted) {

        $scope.votedCold = true;
        $scope.votedHot = false;

      }

      var hasVoted2 = $scope.saving.upVoters.filter(function (voter) {

          return voter === $scope.storage.email;

        }).length > 0;


      if (hasVoted2) {

        $scope.votedCold = false;
        $scope.votedHot = true;

      }

    });

    $http.get('http://www.saveme.ie/posts').success(function (data) {
      $scope.posts = data;

    });


    $scope.productImageSaving = function (saving) {

      console.log(saving);

      var savingURL = $scope.saving.urlimage.charAt(0);
      // console.log(savingURL);

      if (savingURL === '.') {

        while ($scope.saving.urlimage.charAt(0) === '0')
          $scope.saving.urlimage = $scope.saving.urlimage.substr(1);

        // console.log('http://www.saveme.ie/'+ saving.urlimage);

        return 'http://www.saveme.ie/' + $scope.saving.urlimage;


      } else {

        return $scope.saving.urlimage;

      }


    };

    $scope.voteDown = function (saving) {


      $scope.data = {};

      $timeout(function () {

        $http.put("http://www.saveme.ie/api/savings/app/downvote/" + $scope.saving._id + "/" + $scope.storage.email, $scope.data).success(function (data1, status) {

          $scope.hello = data1;

          $scope.votedCold = true;
          $scope.votedHot = false;

        })

      }, 1);


    };

    $scope.voteUp = function (saving) {

      $scope.data = {};

      $timeout(function () {

        $http.put("http://www.saveme.ie/api/savings/app/upvote/" + $scope.saving._id + "/" + $scope.storage.email, $scope.data).success(function (data1, status) {

          $scope.hello = data1;

          $scope.votedCold = false;
          $scope.votedHot = true;

        })

      }, 1);


    };


  })

  .controller('CouponsCtrl', function ($scope) {
    $scope.coupons = [
      {title: 'Reggae1', id: 1},
      {title: 'Chill2', id: 2},
      {title: 'Dubstep3', id: 3},
      {title: 'Indie4', id: 4},
      {title: 'Rap5', id: 5},
      {title: 'Cowbell6', id: 6}
    ];
  })

  .controller('CouponCtrl', function ($scope, $stateParams) {
  })

  .controller('LoginCtrl', function ($scope, $state, $cookieStore, $http) {

  })

  .controller('SignupCtrl', function ($scope, $state, $cookieStore, $http) {

  })

  .controller('ProfileCtrl', function ($scope, $state, $http) {


  });




