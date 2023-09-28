const process = require('process')

const axios = require('axios')
const qs = require('qs')

const handler = async function (event) {
  // apply our function to the queryStringParameters and assign it to a variable
  // const API_PARAMS = qs.stringify(event.queryStringParameters)
  // console.log('API_PARAMS', API_PARAMS)
  // Get env var values defined in our Netlify site UI

  // TODO: customize your URL and API keys set in the Netlify Dashboard
  // this is secret too, your frontend won't see this
  const { GOOGLE_MAPS_API_KEY } = process.env
  const URL = `https://www.youtube.com/`

  console.log('Constructed URL is ...', URL)

  try {
    const { data } = await axios.get(URL)
    // refer to axios docs for other methods if you need them
    // for example if you want to POST data:
    //    axios.post('/user', { firstName: 'Fred' })
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (error) {
    const { data, headers, status, statusText } = error.response
    return {
      statusCode: error.response.status,
      body: JSON.stringify({ status, statusText, headers, data }),
    }
  }
}

// const handler = async function (event) {
//   const { GOOGLE_MAP_API_KEY } = process.env;
  
//   //document.querySelector(".google-maps").replaceChildren();

//   //const template= `<iframe width="100%" height="450" style="border:0" loading="lazy" allowfullscreen src="https://www.google.com/maps/embed/v1/view?key=${GOOGLE_MAP_API_KEY}&center=${lat},${lon}&zoom=10"></iframe>`;
//   const template = `${GOOGLE_MAP_API_KEY}, friends`
//   //document.querySelector(".google-maps").insertAdjacentHTML("beforeend", template);
//   console.log(template);
// };

module.exports = { handler };
