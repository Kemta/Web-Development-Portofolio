import React, { useState } from 'react';

// Helper: Convert number to ⭐ emojis
const getStarEmojis = (count) => {
  return '⭐'.repeat(parseInt(count));
};

const WatchList = () => {
  const [movies, setMovies] = useState([]);
  const [newMovie, setNewMovie] = useState({
    title: '',
    rating: 0,
    review: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMovie(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addMovie = (e) => {
    e.preventDefault();

    if (!newMovie.title || newMovie.rating === 0) {
      alert("Please enter a Movie Title and select a Rating.");
      return;
    }

    const movieToAdd = {
      id: Date.now(),
      title: newMovie.title.trim(),
      rating: parseInt(newMovie.rating),
      review: newMovie.review.trim()
    };

    setMovies(prev => [...prev, movieToAdd]);

    setNewMovie({ title: '', rating: 0, review: '' });
  };

  const removeMovie = (idToRemove) => {
    setMovies(prev => prev.filter(movie => movie.id !== idToRemove));
  };

  // Simple inline styles
  const styles = {
    container: { maxWidth: '700px', margin: '40px auto', padding: '20px', fontFamily: 'Arial', background: '#f9f9f9', borderRadius: '10px' },
    form: { background: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '30px' },
    input: { width: '100%', padding: '10px', marginBottom: '10px' },
    button: { width: '100%', padding: '10px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '5px' },
    movieItem: { display: 'flex', justifyContent: 'space-between', background: 'white', padding: '15px', borderRadius: '8px', marginBottom: '10px' },
    removeButton: { background: '#dc3545', color: 'white', padding: '5px 10px', borderRadius: '4px' }
  };

  return (
    <div style={styles.container}>
      <h1 style={{ textAlign: 'center' }}>🎬 React Movie Watch List</h1>

      <form onSubmit={addMovie} style={styles.form}>
        <input
          name="title"
          value={newMovie.title}
          onChange={handleInputChange}
          placeholder="Movie Title"
          style={styles.input}
        />

        <select
          name="rating"
          value={newMovie.rating}
          onChange={handleInputChange}
          style={styles.input}
        >
          <option value="0">Select Rating</option>
          <option value="1">1 Star</option>
          <option value="2">2 Stars</option>
          <option value="3">3 Stars</option>
          <option value="4">4 Stars</option>
          <option value="5">5 Stars</option>
        </select>

        <textarea
          name="review"
          value={newMovie.review}
          onChange={handleInputChange}
          placeholder="Review (optional)"
          style={styles.input}
        />

        <button style={styles.button}>Add Movie</button>
      </form>

      <h2>My Watch List ({movies.length})</h2>

      {movies.length === 0 ? <p>No movies yet.</p> :
        movies.map(movie => (
          <div key={movie.id} style={styles.movieItem}>
            <div>
              <h3>{movie.title}</h3>
              <p>{getStarEmojis(movie.rating)}</p>
              {movie.review && <em>{movie.review}</em>}
            </div>

            <button
              style={styles.removeButton}
              onClick={() => removeMovie(movie.id)}
            >
              Remove
            </button>
          </div>
        ))
      }
    </div>
  );
};

export default WatchList;
