"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();
  putStoriesOnPage();

}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
      <span class="del-icon"></span>
      <span class="heart"></span>
      <a href="${story.url}" target="a_blank" class="story-link">
      <b>${story.title}</b>
      </a>
      <small class="story-hostname">(${story.url})</small>
      <small class="story-author">by ${story.author}</small>
      <small class="story-user">posted by ${story.username}
      </small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
  checkOP();
  delWorks();
}
function addNewStory() {
  $("#story-button").on("click", function () {
    let title = $("#story-name").val();
    let author = $("#story-author").val();
    let url = $("#story-url").val();
    storyList.addStory(currentUser, { title, author, url, })
    $(".new-story-form").val('');
    checkOP();
    delWorks();
  })
}
function showMyStories() {
  $allStoriesList.empty();
  $myStories.empty();
  if (currentUser.ownStories.length < 1) {
    $allStoriesList.append("<h2> You haven't submitted any stories!</h2>")
  } else {
    for (let i of currentUser.ownStories) {
      let ownStory = generateStoryMarkup(i);
      $allStoriesList.append(ownStory);
    }
  }
}
function showFavoritesList() {
  $allStoriesList.empty()
  $myFavorites.empty()
  if (currentUser.favorites.length < 1) {
    $allStoriesList.append("<h2> You currently don't have any favorites!</h2>")
  } else {
    for (let i of currentUser.favorites) {
      console.log(i)
      let favStory = generateStoryMarkup(i)
      $allStoriesList.append(favStory)
      $(".heart").html('♥')
      $(".heart").addClass('fav')
    }
  }
}

function toggleHeart() {
  $(".heart").on("click", function () {
    let storyNum = $(this).parent().attr('id')
    let story = storyList.stories.filter(x => x.storyId === storyNum)
    if (this.innerText === '♡') {
      currentUser.addFavorite(story)
      this.innerText = '♥';
      this.classList.add("fav")
    } else {
      this.innerText = '♡';
      let favStory = story[0]
      currentUser.removeFavorite(favStory)
      this.classList.remove("fav")
    }
  })
}

// runs when user loads up, marks up favorites of current user.
function checkHearts() {
  let currList = $allStoriesList.children()
  for (let i of currList) {
    if (currentUser.favorites.filter(x => x.storyId === i.id).length > 0) {
      i.children[1].classList.add('fav')
      i.children[1].innerText = '♥';
    }
  }
}

function checkOP() {
  let currList = $allStoriesList.children()
  for (let i of currList) {
    let user = `posted by ${currentUser.username}`
    if (i.children[5].innerText === user) {
      i.children[0].innerText = '❌'
    }
  }
}

function delWorks() {
  $('.del-icon').on("click", function () {
    let storyId = $(this).parent()[0].id;
    let user = currentUser.username;
    storyList.removeStory(user, storyId);
    navAllStories();
  })
}