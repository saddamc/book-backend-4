import { Request, Response } from "express";
import { z } from "zod";
import { Book } from "./book.model";

const CreatedBookZodSchema = z.object({
  title: z.string(),
  author: z.string(),
  genre: z.string().optional(),
  isbn: z.string(),
  description: z.string(),
  copies: z.number(),
  available: z.boolean(),
  image: z.string().optional(),
});

//* create book
export const createBook = async (req: Request, res: Response) => {
  const book = new Book(req.body);
  const bookData = await book.save();
  if (!bookData) {
    res.status(400).json({ message: "Error saving task" });
  } else if (bookData.errors) {
    res
      .status(400)
      .json({ message: "Validation error", errors: bookData.errors });
  }
  res.status(201).json(bookData);
};

//* get Books with filter
export const getBooks = async (req: Request, res: Response) => {
  const books = await Book.find();
  try {
    const {
      filter,
      sortBy = "createdAt",
      sort = "desc",
      limit = "",
    } = req.query;

    const query =
      filter && typeof filter === "string" && filter.trim() !== ""
        ? {
            $or: [
              { title: { $regex: filter, $options: "i" } },
              { author: { $regex: filter, $options: "i" } },
              { genre: { $regex: filter.toUpperCase(), $options: "i" } },
              { isbn: { $regex: filter, $options: "i" } },
            ],
          }
        : {};

    const data = await Book.find(query)
      .sort({ [sortBy as any]: sort === "asc" ? 1 : -1 })
      .limit(Number(limit));

    res.status(201).json({
      success: true,
      message: `${data.length} Books retrieved successfully`,
      data,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Something Wrong",
      error,
    });
  }
};

//* get book by id
export const getBookById = async (req: Request, res: Response) => {
  try {
    const bookId = req.params.id;
    const data = await Book.findById(bookId);

    res.status(201).json({
      success: true,
      message: "Book retrived successfuly",
      data,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Something Wrong",
      error,
    });
  }
};

// Update Book
export const updateBook = async (req: Request, res: Response) => {
  try {
    const bookId = req.params.id;
    // update
    const updatedBody = req.body;
    const data = await Book.findByIdAndUpdate(bookId, updatedBody, {
      new: true,
    });

    res.status(201).json({
      success: true,
      message: "Book updated successfully",
      data,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Something Wrong",
      error,
    });
  }
};

// Delete Book
export const deleteBook = async (req: Request, res: Response) => {
  try {
    const bookId = req.params.id;
    const data = await Book.findOneAndDelete({ _id: bookId });

    res.status(201).json({
      success: true,
      message: "Book Deleted successful",
      data,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Something Wrong",
      error,
    });
  }
};
