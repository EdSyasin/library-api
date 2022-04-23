import { Request, Response } from "express";
import BookRepository from "../services/BookRepository";
import { Types } from "mongoose";
import {IBook} from "../types";

const router = require('express').Router()
const Book = require("../models/Book");
const fileMiddleware = require("../middleware/FileMiddleware");
const requester = require('../utilities/request');
const config = require('../config');

router.get('/:id', async (request: Request, response: Response) => {
    const { id } = request.params;
    const _id = new Types.ObjectId(id)
    const result = await BookRepository.getBook(_id)
    if (result) {
        response.json(result);
    } else {
        response.status(404).json({'error': 'Книга не найдены'});
    }
})

router.get('/', async (request: Request, response: Response) => {
    const result = await BookRepository.getBooks()
    if (result.length > 0) {
        response.json(result);
    } else {
        response.status(404).json({error: 'Книги не найдены'});
    }
})

router.post('/', fileMiddleware.fields([{name: 'book', maxCount: 1}, {name: 'cover', maxCount: 1}]), async (request: Request, response: Response) => {
    const files = request.files
    const book = files && !Array.isArray(files) ? files.book : undefined
    const cover = files && !Array.isArray(files) ? files.cover : undefined
    if(book){
        const {title, description, authors, favorite} = request.body;
        const bookTitle = title || book[0].originalname
        const filename = book[0].originalname;
        const fileBook = book[0].path;
        const fileCover = cover ? cover[0].path : null

        const _id = await BookRepository.createBook({
            title: bookTitle,
            description: description,
            authors: authors,
            favorites: favorite,
            fileCover: fileCover,
            fileName: filename,
            fileBook: fileBook
        })

        response.json(_id);
    } else {
        response.status(400).json({error: 'Нехватает данных'})
    }
})

router.put('/:id', fileMiddleware.single('cover'), async (request: Request, response: Response) => {
    const _id = new Types.ObjectId(request.params.id)
    const bookInput: IBook = {
        title: request.body.title,
        description: request.body.description,
        authors: request.body.authors,
        fileName: request.body.fileName,
        fileBook: request.body.fileBook,
        favorites: request.body.favorites,
        fileCover: request.file?.path || null
    }

    const book = await BookRepository.updateBook(_id, bookInput);
    if (!book) {
        response.status(404).json({error: 'Книга не найдена'});
    } else {
        response.json(book);
    }
})

router.get('/:id/download', async (request: Request, response: Response) => {
    const book = await Book.findById(request.params.id)
    if (!book) {
        response.status(404).json({error: 'Книга не найдена'});
    } else {
        response.download(book.fileBook, book.fileName, err=>{
            if (err){
                response.status(404).json({error: 'Проблема с загрузкой файла'});
            }
        });
    }
});

router.delete('/:id', async (request: Request, response: Response) => {
    const {id} = request.params;
    const _id = new Types.ObjectId(id)
    const result = await BookRepository.deleteBook(_id)
    if (result) {
        response.json('ok');
    } else {
        response.status(404).json({error: 'Книги не найдены'});
    }
})

export default router;
