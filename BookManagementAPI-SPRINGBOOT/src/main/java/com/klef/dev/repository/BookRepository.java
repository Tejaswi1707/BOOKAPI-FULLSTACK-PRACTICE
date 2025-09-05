package com.klef.dev.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.klef.dev.entity.Book;

@Repository
public interface BookRepository extends JpaRepository<Book, Integer> 
{
    Book findByIsbn(String isbn);
    Book findByTitle(String title);
}

