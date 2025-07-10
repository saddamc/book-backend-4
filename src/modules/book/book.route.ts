import { Router } from "express";
import {
  createBook,
  deleteBook,
  getBookById,
  getBooks,
  updateBook,
} from "./book.controller";

export const bookRoute = Router();

bookRoute.post("/api/create-book", createBook);
bookRoute.get("/api/books", getBooks);
bookRoute.get("/api/books/:id", getBookById);
bookRoute.patch("/api/edit-book/:id", updateBook);
bookRoute.delete("/api/books/:id", deleteBook);
