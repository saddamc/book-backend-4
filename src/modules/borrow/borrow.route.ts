import { Router } from "express";
import { borrowBooksSummary, createBorrow } from "./borrow.controller";

export const borrowRoute = Router();

borrowRoute.post("/api/borrow/:bookId", createBorrow);
borrowRoute.get("/api/borrow-summary", borrowBooksSummary);
