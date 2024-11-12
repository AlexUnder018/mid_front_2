
const apiKey = 'daf3d78ed92e3efd339b408a52740b49';
const searchBar = document.getElementById('searchBar');
const moviesGrid = document.getElementById('moviesGrid');
const movieModal = document.getElementById('movieModal');
const modalTitle = document.getElementById('movieTitle');
const modalSynopsis = document.getElementById('movieSynopsis');
const modalDetails = document.getElementById('movieDetails');
const modalCast = document.createElement('div'); // For cast details
const modalReviews = document.createElement('div'); // For user reviews
const modalTrailer = document.createElement('div'); // For trailer
const closeModal = document.querySelector('.close');
const addToWatchlistButton = document.getElementById('addToWatchlist');

let currentMovie = null;
movieModal.appendChild(modalCast);
movieModal.appendChild(modalReviews);
movieModal.appendChild(modalTrailer);

async function fetchTrendingMovies() {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`);
        const data = await res.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('Error fetching trending movies:', error);
    }
}

function displayMovies(movies) {
    moviesGrid.innerHTML = movies
        .map(movie => `
      <div class="movie-card" onclick="showMovieDetails(${movie.id})">
        <img src="https://image.tmdb.org/t/p/w200/${movie.poster_path}" alt="${movie.title}" />
        <h3>${movie.title}</h3>
        <p>${movie.release_date}</p>
      </div>
    `)
        .join('');
}

let debounceTimer;
searchBar.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        const query = searchBar.value.trim();
        if (query.length > 2) {
            searchMovies(query);
        } else {
            fetchTrendingMovies();
        }
    }, 300);
});

async function searchMovies(query) {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`);
        const data = await res.json();
        if (data.results.length > 0) {
            displayMovies(data.results);
        } else {
            moviesGrid.innerHTML = '<p>No movies found.</p>';
        }
    } catch (error) {
        console.error('Error searching movies:', error);
    }
}

async function showMovieDetails(id) {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=credits,reviews,videos`);
        const movie = await res.json();
        currentMovie = movie;

        modalTitle.textContent = movie.title;
        modalSynopsis.textContent = movie.overview || 'No synopsis available.';
        modalDetails.textContent = `Rating: ${movie.vote_average} | Runtime: ${movie.runtime || 'N/A'} mins`;

        const cast = movie.credits.cast.slice(0, 5).map(actor => actor.name).join(', ');
        modalCast.innerHTML = `<strong>Cast:</strong> ${cast || 'Not available.'}`;


        const trailer = movie.videos.results.find(video => video.type === 'Trailer');
        if (trailer) {
            modalTrailer.innerHTML = `
        <h4>Trailer</h4>
        <iframe width="100%" height="315" 
          src="https://www.youtube.com/embed/${trailer.key}" 
          frameborder="0" allowfullscreen>
        </iframe>`;
        } else {
            modalTrailer.innerHTML = '<p>No trailer available.</p>';
        }

        movieModal.classList.remove('hidden');
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}
addToWatchlistButton.addEventListener('click', () => {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    if (!watchlist.some(movie => movie.id === currentMovie.id)) {
        watchlist.push(currentMovie);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        alert(`${currentMovie.title} has been added to your watchlist!`);
    } else {
        alert(`${currentMovie.title} is already in your watchlist.`);
    }
});

closeModal.addEventListener('click', () => {
    movieModal.classList.add('hidden');
});

window.addEventListener('click', (e) => {
    if (e.target === movieModal) {
        movieModal.classList.add('hidden');
    }
});
// -------------------------------
const sortDropdown = document.getElementById('sortMovies');

sortDropdown.addEventListener('change', () => {
    fetchMovies(sortDropdown.value);
});

async function fetchMovies(sortBy = 'popularity.desc') {
    try {
        const res = await fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=${sortBy}`
        );
        const data = await res.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const sliderMenu = document.getElementById('sliderMenu');

    hamburgerBtn.addEventListener('click', () => {
        sliderMenu.classList.toggle('hidden');
        sliderMenu.classList.toggle('visible');
    });

    document.addEventListener('click', (event) => {
        if (!sliderMenu.contains(event.target) && event.target !== hamburgerBtn) {
            sliderMenu.classList.add('hidden');
            sliderMenu.classList.remove('visible');
        }
    });
});


// =========================
fetchTrendingMovies();

