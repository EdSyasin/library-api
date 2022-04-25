import 'reflect-metadata';
import { Container, inject } from 'inversify';
import BookRepository from "./BookRepository";
import BookModel from '../models/Book';
import { TYPES, IBook } from "../types";

const container = new Container();

container.bind<typeof BookModel>(TYPES.BookModel).toConstantValue(BookModel);
container.bind<BookRepository>(TYPES.BookRepository).to(BookRepository);

export default container;

