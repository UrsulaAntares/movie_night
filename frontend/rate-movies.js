
function getMoviesToRate(main, user) {
    console.log("successfully got to next page")
    main.innerHTML = ""
    movieContainer = document.createElement("div")

    let current_user = user
    myMoviesLink.addEventListener('click', (e) => renderMovies(e, user, movieContainer))
    createMovieNightLink.addEventListener('click', (e) => movieNight(e, user, movieContainer))

    fetch("http://localhost:3000/movies")
    .then(res => res.json())
    .then((allMovies) => compareMovies(current_user, allMovies, movieContainer))
    main.append(movieContainer)
    console.log("Hey, we ran the thing")
}

function showMovie(movie, user, container, context) {
    const aMovie = document.createElement("div")
    const movieTitle = document.createElement("h1")
    const moviePic = document.createElement("img")
    moviePic.src= movie.image_url
    moviePic.classList.add('movie-pic', 'thumbnail')
    movieTitle.innerText =  movie.title 
    movieTitle.classList.add('uk-card-title')
    aMovie.append(moviePic, movieTitle)
    aMovie.classList.add('uk-card', 'uk-card-default', 'uk-card-body', 'uk-width-1-2@m')
    
    const movieRatingsContainer = document.createElement("div")
    const movieRatingForm = document.createElement("form")
    movieRatingForm.id = "rating-form"
    const stars = document.createElement("input")
    const hearts = document.createElement("input")
    const submitButton = document.createElement("input")

    stars.type = "range"
    hearts.type = "range"
    stars.name = "stars"
    hearts.name = "hearts"
    // stars.value = "50"
    // hearts.value = "50"
    submitButton.type = "submit"
    submitButton.addEventListener("click", event => createInterest(movie, user, stars.value, hearts.value, context))
    //after running the createInterest, should replace movie in the movie container with a new movie, unrated

    movieRatingForm.append(stars, hearts, submitButton)
    movieRatingsContainer.append(movieRatingForm)
    aMovie.append(movieRatingsContainer)
    container.append(aMovie)
    main.append(container)
} 

function createInterest(movie, user, stars, hearts, context) {
    main.innerHTML = ''
    event.preventDefault()
    // stars = document.getElementById("rating-form").stars.value
    // hearts = document.getElementById("rating-form").hearts.value
    // debugger
    data = {movie_id: movie.id, user_id: user.id, 
        star: stars, heart: hearts}
    fetch("http://localhost:3000/interests", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }).then(res => res.json())
    .then(res => console.log(res))
    if (context == "frontPage-rating") {getMoviesToRate(main, user)}
    console.log("you tried to rate a movie")
    
}

function compareMovies(user, allMovies){
    let currentUserId = parseInt(window.localStorage.getItem('current_user_id'))
    let context = "frontPage-rating"
        
        fetch('http://localhost:3000/filter', {
            method: "POST", 
            headers: {'Content-Type':'application/json', 'Accept':'application/json'},
            body: JSON.stringify({user: user})
        })
        .then(r => r.json())
        .then(unratedMovies => {
            showMovie(unratedMovies[0], user, movieContainer, context)
        })
    
}
