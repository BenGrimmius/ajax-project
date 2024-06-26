var $mainScreen = document.querySelector('.main-screen');
var $browseScreen = document.querySelector('.browse-events-screen');
var $myEventsScreen = document.querySelector('.my-events-screen');

var $browseBtnHome = document.querySelector('.browse-btn-home');
var $myEventsBtnHome = document.querySelector('.my-events-btn-home');
var $browseBtn = document.querySelector('.browse-btn');
var $myEventsBtn = document.querySelector('.my-events-btn');

var $headerText = document.querySelector('.header-text');

var $browseForm = document.querySelector('.browse-form');
var $browseList = document.querySelector('#browse-list');
var $savedList = document.querySelector('#saved-list');

var data = {
  view: 'main',
  nextEntryID: 1,
  saved: []
};

function showBrowse() {
  $mainScreen.classList = 'container maine-screen hidden';
  $browseScreen.classList = 'container browse-events-screen';
  $myEventsScreen.classList = 'container my-events-screen hidden';
  $headerText.textContent = 'Browse Events';
  clearBrowseList();
}

function showMyEvents() {
  $mainScreen.classList = 'container maine-screen hidden';
  $myEventsScreen.classList = 'container my-events-screen';
  $browseScreen.classList = 'container browse-events-screen hidden';
  $headerText.textContent = 'My Events';
  updateSavedList();
}

function clearBrowseList() {
  $browseList.innerHTML = '';
}

$browseBtnHome.addEventListener('click', showBrowse);
$myEventsBtnHome.addEventListener('click', showMyEvents);
$browseBtn.addEventListener('click', showBrowse);
$myEventsBtn.addEventListener('click', showMyEvents);

$browseForm.addEventListener('submit', function (event) {
  event.preventDefault();
  clearBrowseList();

  var Url = 'https://app.ticketmaster.com/discovery/v2/events?apikey=6HZF5VqmF2fTKIqm0RTY6EwrTbNPOLWU&keyword=' + $browseForm[0].value;

  var xhrbrowse = new XMLHttpRequest();
  xhrbrowse.open('GET', Url);
  xhrbrowse.responseType = 'json';
  xhrbrowse.addEventListener('load', function () {
    if (xhrbrowse.response._embedded && xhrbrowse.response._embedded.events) {
      xhrbrowse.response._embedded.events.forEach(function (event) {
        if (!(event._embedded && event._embedded.venues && event._embedded.venues[0])) {
          return;
        }

        var $li = document.createElement('li');
        $li.classList = 'row space-between';

        var $liImage = document.createElement('img');
        $liImage.classList = 'list-img';
        $liImage.setAttribute('src', event.images[1].url);

        var $name = document.createElement('p');
        $name.classList = 'name';
        $name.textContent = event.name;

        var $pDate = document.createElement('p');
        $pDate.classList = 'list-text date';
        $pDate.textContent = event.dates.start.localDate;

        var $pLocation = document.createElement('p');
        $pLocation.classList = 'location';
        $pLocation.textContent = `${event._embedded.venues[0].city.name}, ${event._embedded.venues[0].country.countryCode}`;

        var $divWhite = document.createElement('div');
        $divWhite.classList = 'white-back';

        var $saveBtn = document.createElement('button');
        $saveBtn.classList = 'save';
        $saveBtn.textContent = 'Save';

        var $seeBtn = document.createElement('button');
        $seeBtn.classList = 'see-tix';
        $seeBtn.textContent = 'See Tickets';
        $seeBtn.setAttribute('data-url', event.url);

        $seeBtn.addEventListener('click', function () {
          window.open(event.url, '_blank');
        });

        var $imageNameDiv = document.createElement('div');
        $imageNameDiv.classList = 'row';
        var $datePlaceDiv = document.createElement('div');
        $datePlaceDiv.classList = 'row';
        var $saveSeeDiv = document.createElement('div');
        $saveSeeDiv.classList = 'row';

        $li.appendChild($imageNameDiv);
        $li.appendChild($datePlaceDiv);
        $li.appendChild($saveSeeDiv);
        $imageNameDiv.appendChild($liImage);
        $imageNameDiv.appendChild($name);
        $datePlaceDiv.appendChild($pDate);
        $datePlaceDiv.appendChild($pLocation);
        $saveSeeDiv.appendChild($saveBtn);
        $saveSeeDiv.appendChild($seeBtn);

        if ($name.textContent && $pDate.textContent && $pLocation.textContent && $liImage.src) {
          $browseList.append($li);
        }
      });
    } else {
      console.error('No events found or response structure is incorrect');
    }
  });
  xhrbrowse.send();
});

$browseList.addEventListener('click', function (e) {
  if (e.target.classList.contains('save')) {
    var listItem = e.target.parentElement.parentElement;
    e.target.classList = 'save fa-solid fa-check';
    e.target.textContent = '';
    listItem.entryID = data.nextEntryID++;
    data.saved.push(listItem);

    updateSavedList();
  }
});

$savedList.addEventListener('click', function (e) {
  if (e.target.classList.contains('delete')) {
    var listItem = e.target.parentElement.parentElement;
    var entryID = listItem.entryID;
    data.saved = data.saved.filter(function (item) {
      return item.entryID !== entryID;
    });

    updateSavedList();
  } else if (e.target.classList.contains('see-tix')) {
    var url = e.target.getAttribute('data-url');
    window.open(url, '_blank');
  }
});

function updateSavedList() {
  $savedList.innerHTML = '';

  if (data.saved.length === 0) {
    var emptyMessage = document.createElement('h2');
    emptyMessage.classList = 'empty-message';
    emptyMessage.textContent = 'You have no saved events';
    $savedList.appendChild(emptyMessage);
  } else {
    data.saved.forEach(function (item) {
      var savedItem = document.createElement('li');
      savedItem.innerHTML = item.innerHTML;
      savedItem.classList = 'row space-between';
      savedItem.entryID = item.entryID;

      var seeTicketsButton = savedItem.querySelector('.see-tix');
      seeTicketsButton.addEventListener('click', function () {
        var url = savedItem.querySelector('.see-tix').getAttribute('data-url');
        window.open(url, '_blank');
      });

      savedItem.lastChild.firstChild.classList = 'delete';
      savedItem.lastChild.firstChild.textContent = 'Remove';

      $savedList.appendChild(savedItem);
    });
  }
}
