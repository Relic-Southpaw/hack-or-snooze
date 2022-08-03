"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

function navSubmit() {
  $("#submit").on("click", function () {
    navAllStories();
    $newStory.show()
    addNewStory()
  })
}

$("#favorites").on("click", function () {
  navAllStories();
  showFavoritesList();
})
$("#my-stories").on("click", function () {
  navAllStories();
  showMyStories();
})

$("#nav-user-profile").on("click", function () {
  $allStoriesList.empty();
  let createDate = currentUser.createdAt.slice(0, 10);
  console.log(createDate)
  $allStoriesList.append(`<h3><b>User Profile Info</b></h3>
  <p>Name: ${currentUser.name}</p>
  <p>Username: ${currentUser.username}<p>
  <p>Account Created: ${createDate}</p>`)
})