import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";
import config from "./config.js";

const BookManager = () => {
  const [books, setBooks] = useState([]);
  const [book, setBook] = useState({
    id: "",
    title: "",
    author: "",
    publisher: "",
    category: "",
    isbn: "",
    year: "",
    copies: ""
  });
  const [idToFetch, setIdToFetch] = useState("");
  const [fetchedBook, setFetchedBook] = useState(null);
  const [message, setMessage] = useState("");
  const [editMode, setEditMode] = useState(false);

  const baseUrl = `${config.url}/bookapi`;

  useEffect(() => {
    fetchAllBooks();
  }, []);

  const fetchAllBooks = async () => {
    try {
      const res = await axios.get(`${baseUrl}/all`);
      setBooks(res.data);
    } catch (error) {
      setMessage("Error fetching books.");
    }
  };

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    for (let key in book) {
      if (!book[key] || book[key].toString().trim() === "") {
        setMessage(`Please fill out the ${key} field.`);
        return false;
      }
    }
    return true;
  };

  const addBook = async () => {
    if (!validateForm()) return;
    try {
      await axios.post(`${baseUrl}/add`, book);
      setMessage("Book added successfully.");
      fetchAllBooks();
      resetForm();
    } catch (error) {
      setMessage("Error adding book.");
    }
  };

  const updateBook = async () => {
    if (!validateForm()) return;
    try {
      await axios.put(`${baseUrl}/update`, book);
      setMessage("Book updated successfully.");
      fetchAllBooks();
      resetForm();
    } catch (error) {
      setMessage("Error updating book.");
    }
  };

  const deleteBook = async (id) => {
    try {
      await axios.delete(`${baseUrl}/delete/${id}`);
      setMessage("Book deleted successfully.");
      fetchAllBooks();
    } catch (error) {
      setMessage("Error deleting book.");
    }
  };

  const getBookById = async () => {
    try {
      const res = await axios.get(`${baseUrl}/get/${idToFetch}`);
      setFetchedBook(res.data);
      setMessage("");
    } catch (error) {
      setFetchedBook(null);
      setMessage("Book not found.");
    }
  };

  const handleEdit = (b) => {
    setBook(b);
    setEditMode(true);
    setMessage(`Editing book with ID ${b.id}`);
  };

  const resetForm = () => {
    setBook({
      id: "",
      title: "",
      author: "",
      publisher: "",
      category: "",
      isbn: "",
      year: "",
      copies: ""
    });
    setEditMode(false);
  };

  return (
    <div className="book-container">
      {message && (
        <div className={`message-banner ${message.toLowerCase().includes("error") ? "error" : "success"}`}>
          {message}
        </div>
      )}

      <h2>Book Management</h2>

      {/* Add / Edit Form */}
      <div>
        <h3>{editMode ? "Edit Book" : "Add Book"}</h3>
        <div className="form-grid">
          <input type="number" name="id" placeholder="ID" value={book.id} onChange={handleChange} />
          <input type="text" name="title" placeholder="Title" value={book.title} onChange={handleChange} />
          <input type="text" name="author" placeholder="Author" value={book.author} onChange={handleChange} />
          <input type="text" name="publisher" placeholder="Publisher" value={book.publisher} onChange={handleChange} />
          <input type="text" name="category" placeholder="Category" value={book.category} onChange={handleChange} />
          <input type="text" name="isbn" placeholder="ISBN" value={book.isbn} onChange={handleChange} />
          <input type="number" name="year" placeholder="Year" value={book.year} onChange={handleChange} />
          <input type="number" name="copies" placeholder="Copies" value={book.copies} onChange={handleChange} />
        </div>

        <div className="btn-group">
          {!editMode ? (
            <button className="btn-blue" onClick={addBook}>Add Book</button>
          ) : (
            <>
              <button className="btn-green" onClick={updateBook}>Update Book</button>
              <button className="btn-gray" onClick={resetForm}>Cancel</button>
            </>
          )}
        </div>
      </div>

      {/* Fetch by ID */}
      <div>
        <h3>Get Book By ID</h3>
        <input type="number" value={idToFetch} onChange={(e) => setIdToFetch(e.target.value)} placeholder="Enter ID" />
        <button className="btn-blue" onClick={getBookById}>Fetch</button>

        {fetchedBook && (
          <div>
            <h4>Book Found:</h4>
            <pre>{JSON.stringify(fetchedBook, null, 2)}</pre>
          </div>
        )}
      </div>

      {/* All Books */}
      <div>
        <h3>All Books</h3>
        {books.length === 0 ? (
          <p>No books found.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  {Object.keys(book).map((key) => <th key={key}>{key}</th>)}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((b) => (
                  <tr key={b.id}>
                    {Object.keys(book).map((key) => <td key={key}>{b[key]}</td>)}
                    <td>
                      <div className="action-buttons">
                        <button className="btn-green" onClick={() => handleEdit(b)}>Edit</button>
                        <button className="btn-red" onClick={() => deleteBook(b.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookManager;
