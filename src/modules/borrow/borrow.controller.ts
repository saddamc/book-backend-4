import { Request, Response } from "express";
import { Book } from "../book/book.model";
import { Borrow } from "./borrow.model";

//* borrow books

export const createBorrow = async (req: Request, res: Response) => {
  try {
    const book = req.params.bookId;
    const { borrowerName, quantity, dueDate } = req.body;

    const bookDoc = await Book.findById(book);

    // ❌ Book not found
    if (!bookDoc) {
      res.status(404).json({
        success: false,
        message: `Book ID: ${book} does not exist`,
      });
      return;
    }

    //  Not enough copies
    if (quantity > bookDoc.copies) {
      res.status(400).json({
        success: false,
        message: `Only ${bookDoc.copies} copies are available, you requested ${quantity}`,
      });
      return;
    }

    //  Update stock
    await bookDoc.updateStock(quantity);

    //  Create borrow record
    const borrow = await Borrow.create({
      book,
      borrowerName,
      quantity,
      dueDate,
    });

    // Populate book details
    const populatedBorrow = await borrow.populate("book");

    //  Success response
    res.status(201).json({
      success: true,
      message: "Book borrowed successfully",
      data: populatedBorrow,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error?.message || error,
    });
  }
};

// borrow Summary
export const borrowBooksSummary = async (req: Request, res: Response) => {
  try {
    const borrowSummary = await Borrow.aggregate([
      {
        $group: {
          _id: "$book",
          totalQuantity: { $sum: "$quantity" },
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      {
        $unwind: "$bookDetails",
      },
      {
        $project: {
          _id: 0,
          book: {
            title: "$bookDetails.title",
            isbn: "$bookDetails.isbn",
          },
          totalQuantity: 1,
        },
      },
    ]);

    const totalBooks = borrowSummary.reduce(
      (acc, curr) => acc + curr.totalQuantity,
      0
    );

    const numberOfBooks = borrowSummary.length;
    // console.log("summary:", borrowSummary);
    res.status(201).json({
      success: true,
      message: `Borrowed: ${numberOfBooks} books & Total Books: ${totalBooks} `,
      data: borrowSummary,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Something Wrong",
      error,
    });
  }
};
