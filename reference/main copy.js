var contributors = [];

var addContributor = function (data) {
  var contributor = { 
    img: data.author.avatar_url,
    login: data.author.login
  }
  contributors.push(contributor);
}

var renderContributors = function () {
  $('#commits').empty();
  for (var i = 0; i < contributors.length; i++){
    var source = $('#contributor-template').html();
    var template = Handlebars.compile(source);
    var contributorHTML = template(contributors[i]);
    $('.commits').append(contributorHTML);
  }



}

var fetchData = function (sha) {
  $.ajax({
    method: "GET",
    url: "https://api.github.com/repos/facebook/react/commits/" + sha,
    dataType: "json",
    success: function(data) {
      addContributor(data);
      console.log(data);
      renderContributors();
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};
  
 
$('#search').on('click', function (){
  console.log('click');
  var sha = $('#sha').val();
  console.log(sha);
  fetchData(sha);
});


renderContributors();