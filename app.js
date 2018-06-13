$(function() {
  getStories();

  if (isLoggedIn() === true) {
    let $localToken = localStorage.getItem('token');
    let $localUsername = JSON.parse(atob($localToken.split('.')[1])).username;
    $('#login').hide();
    $('#profile')
      .css({ 'font-weight': 800, 'padding-right': '2px' })
      .text($localUsername)
      .show();
    $('#logout').show();
  }

  $('#posts-page ol').on('click', 'i:last-of-type', function(event) {
    deletePost(
      $(event.target)
        .closest('li')
        .attr('id')
    )
      .then(function() {
        $(event.target)
          .closest('li')
          .fadeOut();
      })
      .catch(function() {
        alert('failed to delete story, please try again');
      });
  });

  $('.front-page').on('click', function() {
    $('#posts').removeClass('active');
    $('#profile').removeClass('active');
    $('#favorites').removeClass('active');
    $('#new').addClass('active');
    $('#list').show();
    $('#posts-page').hide();
    $('#favorites-page').hide();
    $('#profile-page').hide();
    $('#favorites').show();
    $('#list ol')
      .children()
      .remove();
    getStories();
  });

  $('ol').on('click', '.fa-bookmark', function(event) {
    if ($(event.target).hasClass('far')) {
      addFavorite(
        $(event.target)
          .parent()
          .attr('id')
      )
        .then(function() {
          $(event.target).removeClass('far');
          $(event.target).addClass('fas fa-pulse');
          setTimeout(() => {
            $(event.target).removeClass('fa-pulse');
          }, 1000);
        })
        .catch(function() {
          alert('failed to favorite story, please try again');
        });
    } else {
      deleteFavorite(
        $(event.target)
          .parent()
          .attr('id')
      )
        .then(function() {
          $(event.target).removeClass('fas');
          $(event.target).addClass('far');
        })
        .catch(function() {
          alert('failed to remove favorite, please try again');
        });
    }
  });

  $('ol').on('click', '.url-span', function(event) {
    $('li:not(:contains("' + $(event.target).text() + '"))').hide();
    $('#favorites').show();
  });

  $('#submit-form').on('click', function() {
    if (isLoggedIn() === false) {
      $('#login-modal').modal('show');
    } else {
      $('#story-form').slideToggle();
    }
  });

  $('#story-form').on('submit', function(event) {
    event.preventDefault();
    createStory($('#title').val(), $('#author').val(), $('#url').val());
  });

  $('#favorites').on('click', function() {
    if (isLoggedIn() === false) {
      $('#login-modal').modal('show');
    } else {
      $('#story-form').slideUp();
      renderFavorites();
    }
  });

  $('#posts').on('click', function() {
    if (isLoggedIn() === false) {
      $('#login-modal').modal('show');
    } else {
      $('#story-form').slideUp();
      renderPosts();
    }
  });

  $('#profile').on('click', function() {
    $('#list').hide();
    $('#posts-page').hide();
    $('#favorites-page').hide();
    $('#profile-page').show();
    $('#new').removeClass('active');
    $('#posts').removeClass('active');
    $('#favorites').removeClass('active');
    $('#profile').addClass('active');
    $('#story-form').slideUp();
    $('#profile-page ul')
      .children()
      .remove();
    getUser()
      .then(function(data) {
        $('#profile-page ul').append(
          $('<li>')
            .text(`name: ${data.data.name}`)
            .addClass('title-span'),
          $('<li>')
            .text(`username: ${data.data.username}`)
            .addClass('title-span')
        );
      })
      .catch(function() {
        alert('failed to retrieve user, please try again');
      });
  });

  $('#login').on('click', function() {
    $('#login-form')
      .trigger('reset')
      .show();
    $('#signup-form')
      .trigger('reset')
      .hide();
  });

  $('#login-form').on('submit', function(event) {
    event.preventDefault();
    storeToken($('#login-user').val(), $('#login-pwd').val()).then(function() {
      let $localToken = localStorage.getItem('token');
      let $localUsername = JSON.parse(atob($localToken.split('.')[1])).username;
      if (isLoggedIn() === true) {
        $('#login-modal').modal('hide');
        $('#login-form').trigger('reset');
        $('#login').hide();
        $('#profile')
          .css({ 'font-weight': 800, 'padding-right': '2px' })
          .text($localUsername)
          .show();
        $('#logout').show();
      }
    });
  });

  $('#create-acct').on('click', function() {
    $('#login-form').hide();
    $('#signup-form').show();
  });

  $('#signup-form').on('submit', function(event) {
    event.preventDefault();
    createUser($('#create-name').val(), $('#create-user').val(), $('#create-pwd').val())
      .then(function() {
        storeToken($('#create-user').val(), $('#create-pwd').val());
        let $localToken = localStorage.getItem('token');
        let $localUsername = JSON.parse(atob($localToken.split('.')[1])).username;
        $('#login-modal').modal('hide');
        $('#signup-form').trigger('reset');
        $('#login').hide();
        $('#profile')
          .css({ 'font-weight': 800, 'padding-right': '2px' })
          .text($localUsername)
          .show();
        $('#logout').show();
      })
      .catch(function() {
        alert('failed to create user, please try again');
      });
  });

  $('#logout').on('click', function() {
    localStorage.clear();
    $('#login').show();
    $('#profile')
      .hide()
      .removeClass('active');
    $('#logout').hide();
    $('#posts-page').hide();
    $('#favorites-page').hide();
    $('#profile-page').hide();
    $('#story-form').slideUp();
    $('#profile')
      .hide()
      .removeClass('active');
    $('#favorites').removeClass('active');
    $('#profile').removeClass('active');
    $('#posts').removeClass('active');
    $('#new').removeClass('active');
    $('#list').show();
    $('#list ol')
      .children()
      .remove();
    getStories();
  });
});
