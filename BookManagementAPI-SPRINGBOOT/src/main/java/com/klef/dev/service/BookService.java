package com.klef.dev.service;


import java.util.List;
import com.klef.dev.entity.Book;

public interface BookService {
    Book addBook(Book book);
    List<Book> getAllBooks();
    Book getBookById(int id);
    Book updateBook(Book book);
    void deleteBookById(int id);
}
