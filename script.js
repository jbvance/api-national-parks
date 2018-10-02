const apiKey = 'pPkxDmFbYYBdXzVGeXttprQbHTpLBAocxLfJOqy4';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function getParksByState(searchTerm, limit = 10) {

    const params = {
    api_key: apiKey,
    stateCode: searchTerm,
    limit
  }
  const queryString = formatQueryParams(params);
  const url = `https://developer.nps.gov/api/v1/parks?${queryString}`  
  fetch(url)
    .then(res => {      
      if (res.ok) {        
        return res.json()
      }
      throw new Error(res.statusText);
    })
    .then(resJson => {
      displayParks(resJson)
    })
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function displayParks(resJson) {
  let strHtml = '';
  console.log(resJson)
  $('#results-list').empty();
  for (let i = 0; i < resJson.data.length; i++) {   
    $('#results-list').append(
      `<li>
        <h3>
          <a href="${resJson.data[i].url}">${resJson.data[i].fullName}</a>
        </h3>        
      </li>`
    )
  };
  //display the results section  
  $('#results').removeClass('hidden');
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-states').val();
    const limit = parseInt($("#js-limit").val()) - 1;
    // Reset error message and hide search results
    $('#js-error-message').empty();
    $('#results').addClass('hidden');

    getParksByState(searchTerm, limit)
  });
}

$(watchForm);