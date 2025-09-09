import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';
import config from './config.js';

const BookManager = () => {
  const [books, setBooks] = useState([]);
  const [book, setBook] = useState({
    id: '',
    title: '',
    author: '',
    publisher: '',
    category: '',
    isbn: '',
    year: '',
    copies: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState('');
  const [searchId, setSearchId] = useState('');
  const [deleteId, setDeleteId] = useState('');
  const [viewBook, setViewBook] = useState(null);
  
  const baseUrl = `${config.url}/bookapi`;

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${config.url}/all`);
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
      setMessage('Failed to fetch books.');
    }
  };

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    for (let key in book) {
      if (!editMode && key === 'id') continue; 
      if (!book[key] || book[key].toString().trim() === '') {
        setMessage(`Please fill out the ${key} field.`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editMode) {
        await axios.put(`${config.url}/update`, book);
        setMessage('Book updated successfully!');
      } else {
        await axios.post(`${config.url}/add`, book);
        setMessage('Book added successfully!');
      }
      setBook({ id: '', title: '', author: '', publisher: '', category: '', isbn: '', year: '', copies: '' });
      setEditMode(false);
      fetchBooks();
    } catch (error) {
      console.error('Error saving book:', error);
      setMessage('Operation failed.');
    }
  };

  const handleEdit = (b) => {
    setBook(b);
    setEditMode(true);
    setMessage('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.delete(`${config.url}/delete/${id}`);
        setMessage('Book deleted successfully!');
        fetchBooks();
      } catch (error) {
        console.error('Error deleting book:', error);
        setMessage('Delete failed.');
      }
    }
  };

  const handleDeleteById = async () => {
    if (!deleteId.trim()) {
      setMessage('Please enter a Book ID to delete.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete book with ID ${deleteId}?`)) {
      try {
        await axios.delete(`${config.url}/delete/${deleteId}`);
        setMessage('Book deleted successfully!');
        setDeleteId('');
        fetchBooks();
      } catch (error) {
        console.error('Error deleting book by ID:', error);
        setMessage('Book not found or delete failed.');
      }
    }
  };

  const handleViewById = async () => {
    if (!searchId.trim()) {
      setMessage('Please enter a Book ID.');
      setViewBook(null);
      return;
    }

    try {
      const response = await axios.get(`${config.url}/get/${searchId}`);
      setViewBook(response.data);
      setMessage('');
    } catch (error) {
      console.error('Error fetching book by ID:', error);
      setMessage('Book not found.');
      setViewBook(null);
    }
  };

  return (
    <div className="book-container">
      <h2>Book Manager</h2>
      {message && <p className="message">{message}</p>}

      {/* Add / Update Form */}
      <form onSubmit={handleSubmit}>
        {!editMode && <input type="text" name="id" placeholder="ID" value={book.id} onChange={handleChange} />}
        <input type="text" name="title" placeholder="Title" value={book.title} onChange={handleChange} />
        <input type="text" name="author" placeholder="Author" value={book.author} onChange={handleChange} />
        <input type="text" name="publisher" placeholder="Publisher" value={book.publisher} onChange={handleChange} />
        <input type="text" name="category" placeholder="Category" value={book.category} onChange={handleChange} />
        <input type="text" name="isbn" placeholder="ISBN" value={book.isbn} onChange={handleChange} />
        <input type="number" name="year" placeholder="Year" value={book.year} onChange={handleChange} />
        <input type="number" name="copies" placeholder="Copies" value={book.copies} onChange={handleChange} />
        <button className="btn btn-blue" type="submit">{editMode ? 'Update Book' : 'Add Book'}</button>
        {editMode && (
          <button
            className="btn btn-gray"
            type="button"
            onClick={() => {
              setBook({ id: '', title: '', author: '', publisher: '', category: '', isbn: '', year: '', copies: '' });
              setEditMode(false);
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* View by ID */}
      <h3>View Book by ID</h3>
      <input type="text" placeholder="Enter Book ID" value={searchId} onChange={(e) => setSearchId(e.target.value)} />
      <button className="btn btn-blue" onClick={handleViewById}>View</button>

      {viewBook && (
        <div className="book-view">
          <p><strong>ID:</strong> {viewBook.id}</p>
          <p><strong>Title:</strong> {viewBook.title}</p>
          <p><strong>Author:</strong> {viewBook.author}</p>
          <p><strong>Publisher:</strong> {viewBook.publisher}</p>
          <p><strong>Category:</strong> {viewBook.category}</p>
          <p><strong>ISBN:</strong> {viewBook.isbn}</p>
          <p><strong>Year:</strong> {viewBook.year}</p>
          <p><strong>Copies:</strong> {viewBook.copies}</p>
        </div>
      )}

      {/* Delete by ID */}
      <h3>Delete Book by ID</h3>
      <input type="text" placeholder="Enter Book ID to delete" value={deleteId} onChange={(e) => setDeleteId(e.target.value)} />
      <button className="btn btn-red" onClick={handleDeleteById}>Delete</button>

      {/* Book List */}
      <h3>Book List</h3>
      {books.length === 0 ? (
        <p>No books available</p>
      ) : (
        <table className="book-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Year</th>
              <th>Copies</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.title}</td>
                <td>{b.author}</td>
                <td>{b.year}</td>
                <td>{b.copies}</td>
                <td>
                  <button className="btn btn-green" onClick={() => handleEdit(b)}>Edit</button>
                  <button className="btn btn-red" onClick={() => handleDelete(b.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BookManager;
