var $mainScreen = document.querySelector('.main-screen');
var $browseScreen = document.querySelector('.browse-events-screen');
var $myEventsScreen = document.querySelector('.my-events-screen');

var $browseBtnHome = document.querySelector('.browse-btn-home');
var $myEventsBtnHome = document.querySelector('.my-events-btn-home');
var $browseBtn = document.querySelector('.browse-btn');
var $myEventsBtn = document.querySelector('.my-events-btn');
// var $cancelSend = document.querySelector('.cancel-send');

var $headerText = document.querySelector('.header-text');

var $browseForm = document.querySelector('.browse-form');
var $browseList = document.querySelector('#browse-list');
var $savedList = document.querySelector('#saved-list');
// var $emailForm = document.querySelector('.email-form');

// var $modalContainer = document.querySelector('.modal-container');

function showBrowse() {
  $mainScreen.classList = 'container maine-screen hidden';
  $browseScreen.classList = 'container browse-events-screen';
  $myEventsScreen.classList = 'container my-events-screen hidden';
  $headerText.textContent = 'Browse Events';
}

function showMyEvents() {
  $mainScreen.classList = 'container maine-screen hidden';
  $myEventsScreen.classList = 'container my-events-screen';
  $browseScreen.classList = 'container browse-events-screen hidden';
  $headerText.textContent = 'My Events';
}

$browseBtnHome.addEventListener('click', function () {
  showBrowse();
});

$myEventsBtnHome.addEventListener('click', function () {
  showMyEvents();
});

$browseBtn.addEventListener('click', function () {
  showBrowse();
});

$myEventsBtn.addEventListener('click', function () {
  showMyEvents();
});

// $emailForm.addEventListener('submit', emailSubmit);

// $cancelSend.addEventListener('click', () => {
//   event.preventDefault();
//   $modalContainer.classList = 'modal-container hidden';
// });

$browseForm.addEventListener('submit', function () {
  event.preventDefault();
  $browseList.innerHTML = '';

  var Url = 'https://app.ticketmaster.com/discovery/v2/events?apikey=6HZF5VqmF2fTKIqm0RTY6EwrTbNPOLWU&keyword=' + $browseForm[0].value;

  var xhrbrowse = new XMLHttpRequest();
  xhrbrowse.open('GET', Url);
  xhrbrowse.responseType = 'json';
  xhrbrowse.addEventListener('load', function () {

    for (var i = 0; i < xhrbrowse.response._embedded.events.length; i++) {

      var listArray = [];

      var $li = document.createElement('li');
      $li.classList = 'row space-between';

      var $liImage = document.createElement('img');
      $liImage.classList = 'list-img';
      $liImage.setAttribute('src', xhrbrowse.response._embedded.events[i].images[1].url);

      var $name = document.createElement('p');
      $name.classList = 'name';
      $name.textContent = xhrbrowse.response._embedded.events[i].name;

      var $pDate = document.createElement('p');
      $pDate.classList = 'list-text date';
      $pDate.textContent = xhrbrowse.response._embedded.events[i].dates.start.localDate;

      var venue = xhrbrowse.response._embedded.events[i]._embedded.venues[0];
      var $pLocation = document.createElement('p');
      $pLocation.classList = 'location';
      $pLocation.textContent = venue ? `${venue.city.name}, ${venue.country.countryCode}` : 'Location not available';
      // `${xhrbrowse.response._embedded.events[i]._embedded.venues[0].city.name},
      // ${xhrbrowse.response._embedded.events[i]._embedded.venues[0].country.countryCode}`;

      var $divWhite = document.createElement('div');
      $divWhite.classList = 'white-back';

      var $saveBtn = document.createElement('button');
      $saveBtn.classList = 'save';
      $saveBtn.textContent = 'Save';

      var $seeBtn = document.createElement('a');
      $seeBtn.classList = 'see-tix';
      $seeBtn.textContent = 'See';
      $seeBtn.setAttribute('target', '_blank');
      $seeBtn.setAttribute('href', xhrbrowse.response._embedded.events[0].url);

      var $VenueAndDate = document.createElement('div');
      $VenueAndDate.classList = 'flex venue-and-date white-back align-center';

      // var shareButton = document.createElement('button');
      // shareButton.classList = 'share';
      // shareButton.textContent = 'Share';
      // shareButton.addEventListener('click', share);

      $li.appendChild($VenueAndDate);

      $VenueAndDate.appendChild($liImage);
      $VenueAndDate.appendChild($name);
      $VenueAndDate.appendChild($pDate);

      $li.appendChild($pLocation);
      $li.appendChild($divWhite);
      $divWhite.appendChild($saveBtn);
      $divWhite.appendChild($seeBtn);
      // $divWhite.appendChild(shareButton);

      listArray.push($li);

      $browseList.append(listArray[0]);

    }
  });
  xhrbrowse.send();
});

$browseList.addEventListener('click', e => {
  var savedEvents = [];

  if (e.target.classList.contains('save')) {
    var listItem = e.target.parentElement.parentElement;
    listItem.entryID = data.nextEntryID;
    data.nextEntryID += 1;
    savedEvents.push(listItem);
    data.saved.push(listItem);
  }
  savedEvents.forEach(item => {
    var savedItem = document.createElement('li');
    savedItem.innerHTML = item.innerHTML;
    savedItem.classList = 'row space-between';
    savedItem.lastChild.firstChild.classList = 'delete';
    savedItem.lastChild.firstChild.textContent = 'Remove';
    // savedItem.lastChild.lastChild.addEventListener('click', share);
    $savedList.appendChild(savedItem);
  });

  if ($savedList.children.length === 0) {
    var emptyMessage = document.createElement('li');
    emptyMessage.classList = 'empty-message';
    emptyMessage.textContent = 'You have no saved events';
    $savedList.appendChild(emptyMessage);
  }
});

$savedList.addEventListener('click', e => {
  if (e.target.classList.contains('delete')) {
    var listItem = e.target.parentElement.parentElement;
    $savedList.removeChild(listItem);
    for (var i = 0; i < data.saved.length; i++) {
      if (listItem.entryID === data.saved[i].entryID) {
        data.saved.splice(i, 1);
      }
    }
  }
});

// function share() {
//   $modalContainer.classList = 'modal-container';
// }

// function emailSubmit() {
//   event.preventDefault();
//   var emailAddress = $emailForm[0].value;
//   $emailForm.setAttribute('action', 'mailto:' + emailAddress);
//   $emailForm.submit();
// }
