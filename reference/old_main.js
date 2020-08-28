var books = [
    // {
    //   title: 'Harry Potter',
    //   author: 'J.K. Rowling',
    //   imageURL: 'https://books.google.com/books/content?id=WV8pZj_oNBwC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
    //   isbn: '9781921479311',
    //   pageCount: 268
    // }
];
var search = '';
var offset = 0;
var totalResults = 0;
var renderBooks = function () {
    console.log('about to hide');
    $('.sk-fold').attr('hidden', '');
    $('.books').empty();

    let source = $("#book-template").html();
    let template = Handlebars.compile(source);
    let newHtml;

    for (let i = 0; i < books.length; i++) {
        let newObject = {
            title: books[i].title,
            author: books[i].authors[0],
            imageURL: books[i].imageLinks.smallThumbnail,
            isbn: books[i].industryIdentifiers[0].identifier,
            pageCount: books[i].pageCount
        }
        newHtml = template(newObject);
        $('.books').append(newHtml);
       
    }
     //forget books
     books = [];
    
     
};

//renderBooks();
var addBooks = function (data) {
    //get total entries while we're here
    // only grab this the first time, even though it changes
    if (offset === 0) {
    totalResults = data.totalItems; }

    console.log('totalResults found: ', totalResults);
    for( let i = 0; i < data.items.length; i++) {
        console.log(books.push(data.items[i].volumeInfo));
    }
    renderBooks();
};

var fetch = function (query) {
    console.log('at fetch() query is ', query);
    $('.sk-fold').removeAttr('hidden');
    $.ajax({
        method: "GET",
        url: `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${offset}&maxResults=10`,
        dataType: "json",
        startIndex: 9,
        maxResults: 10,
        success: function(data) {
          addBooks(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(textStatus);
        }
      });

    console.log('at fetch()end query is ', query);
};

$('.search').on('click', function () {
    console.log('at click() query is ', $('#search-query').val());
    search = $('#search-query').val();
  
    fetch(search);
    console.log('at click()end query is ', $('#search-query').val());
});

$('#prev').on('click', function () {
    if (offset >= 10) {
        offset -= 10;}
    else {
        offset = 0;
    } // just in case of weirdness
    fetch(search);     
});

$('#next').on('click', function () {
    if (offset < totalResults) {
    offset += 10;
    fetch(search);
    };
});
