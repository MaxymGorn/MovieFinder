function MyViewModel() {
    var self = this;
    self.typeOptions = ko.observableArray(["Movie", "Series", "Episode"]);
    self.selectedType = ko.observable();
    self.movies = ko.observableArray();
    self.searchTerm = ko.observable();
    self.moreInfo = ko.observableArray();
    self.currentMovie = {
        Type: ko.observable(),
        Year: ko.observable(),
        Genre: ko.observable(),
        Released: ko.observable(),
        Runtime: ko.observable(),
        Poster: ko.observable(),
        Rated: ko.observable(),
        imdbRating: ko.observable(),
        imdbVotes: ko.observable(),
        Actors: ko.observable(),
        Plot: ko.observable(),
        Writer: ko.observable(),
        Director: ko.observable(),
        Country: ko.observable(),
        Language: ko.observable(),
        Title: ko.observable()

    };
    self.isPushing;
    self.page = 1;
    self.optionsAfterRender = function (option, view) {
        if (view.defaultView) {
            option.className = 'select-type';
        }
    };
    self.loadMore = ko.observable(false);
    self.error = ko.observable(false);
    self.errorMessage = ko.observable();
    self.pushMovies = function () {
        self.page += 1;
        $.getJSON('https://www.omdbapi.com/?s=' + self.searchTerm() + '&type=' + self.selectedType() + '&page=' + self.page + '&apikey=d454a0a3', {
            api_key: 'd454a0a3'
        }).done(function (data) {
            let tempDataPosters = data.Search;
            try {
                for (let i = 0; i < tempDataPosters.length; i++) {
                    if (tempDataPosters[i].Poster === "N/A") {
                        tempDataPosters[i].Poster = "../img/no-img.jpg";
                    }
                    tempDataPosters[i].Poster = `url(${tempDataPosters[i].Poster})`;
                    tempDataPosters[i].imdbID = `http://www.imdb.com/title/${tempDataPosters[i].imdbID}/`;
                }
                //self.movies.push(tempDataPosters[i]);
            } catch (e) {

            }
            console.log("Page: " + self.page + "Data: " + data);
            if (data.Search) {
                let resultArray = tempDataPosters;
                for (let i = 0; i < resultArray.length; i++) {
                    self.isPushing = setTimeout(function run() {
                        if (self.isPushing !== false)
                            self.movies.push(resultArray[i]);
                    }, 300 * i);
                }
                //self.movies.apply(self.movies, resultArray);
                //console.log(resultArray);
            } else {

            }

        });
    };

    self.searchForMovies = function () {
        if ($(".searchForm").val() == "") {
            alert("Plese Enter a search movie!")
            return;
        }
        self.page = 1;
        clearTimeout(self.isPushing);
        self.isPushing = false;
        console.log(`Selected type: ${self.selectedType()}`);
        $.getJSON('https://www.omdbapi.com/?s=' + self.searchTerm() + '&type=' + self.selectedType() + '&page=' + self.page + '&apikey=d454a0a3', {
            api_key: 'd454a0a3'
        }).done(function (data) {
            self.error(false);
            self.errorMessage('Error search!');
            try {
                let tempDataPosters = data.Search;
                for (let i = 0; i < tempDataPosters.length; i++) {
                    if (tempDataPosters[i].Poster === "N/A") {
                        tempDataPosters[i].Poster = "../img/no-img.jpg";
                    }
                    tempDataPosters[i].Poster = `url(${tempDataPosters[i].Poster})`;
                    tempDataPosters[i].imdbID = `http://www.imdb.com/title/${tempDataPosters[i].imdbID}/`;
                }
                data.Search = tempDataPosters;
                console.log(data.Search);
            } catch (e) {
                $(".results").fadeOut("fast");
            }
            if (data.Search) {
                ko.mapping.fromJS(data.Search, {}, self.movies);
                self.loadMore(true);
            } else {
                self.error(true);
                self.loadMore(false);
                self.errorMessage(data.Error);
            }
        });
    };

    self.viewMoreInfo = function (movie) {
        console.log("https://omdbapi.com/?t=" + movie.Title() + '&apikey=d454a0a3');
        $.getJSON("https://omdbapi.com/?t=" + movie.Title() + '&apikey=d454a0a3', {
            api_key: 'd454a0a3'
        }).done(function (data) {
            console.log(data);
            let tempData = data;
            try {
                if (tempData.Poster === "N/A") {
                    tempData.Poster = "../img/no-img.jpg";
                }
                tempData.imdbID = `http://www.imdb.com/title/${tempData.imdbID}/`;
                data = tempData;
            } catch (exception) {}
            if (data) {
                ko.mapping.fromJS(data, {}, self.currentMovie);
            } else {
                self.error(true);
                self.errorMessage(data.Error);
            }
            console.log(self.currentMovie.Type);
        });
    };

    self.clear = function () {
        clearTimeout(self.isPushing);
        self.isPushing = false;
        $(".searchForm").val("");
        $(".results").fadeOut("fast");
        self.loadMore(false);
        self.page = 1;

    };

};


ko.applyBindings(new MyViewModel());
