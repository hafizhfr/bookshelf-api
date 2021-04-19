const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    // eslint-disable-next-line max-len
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
  };

  const isSuccess = true;
  // const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    if (name !== undefined) {
      if (readPage <= pageCount) {
        books.push(newBook);

        const response = h.response({
          status: 'success',
          message: 'Buku berhasil ditambahkan',
          data: {
            bookId: id,
          },
        });
        response.code(201);
        return response;
      }
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  const response = h.response({
    status: 'error',
    message: 'Catatan gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request) => {
  const { name, reading, finished } = request.query;
  const isUsingQuery = name !== undefined || reading !== undefined || finished !== undefined;
  const data = books.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));
  let newData = books;

  if (books.length > 0) {
    if (isUsingQuery) {
      if (name !== undefined) {
        newData = books.filter((book) => book.name.toString().toUpperCase()
          .includes(name.toString().toUpperCase()));
      }
      if (reading === '1') {
        newData = (books.filter((book) => book.reading === true));
      } else if (reading === '0') {
        newData = (books.filter((book) => book.reading === false));
      }
      if (finished === '1') {
        newData = (books.filter((book) => book.finished === true));
      } else if (finished === '0') {
        newData = (books.filter((book) => book.finished === false));
      }
      return {
        status: 'success',
        data: {
          books: newData.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      };
    }
    return {
      status: 'success',
      data: {
        books: data,
      },
    };
  }
  return {
    status: 'success',
    data: {
      books: [],
    },
  };
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.filter((it) => it.id === bookId)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const finished = readPage === pageCount;
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    if (name !== undefined) {
      if (readPage <= pageCount) {
        books[index] = {
          ...books[index],
          bookId,
          name,
          year,
          author,
          summary,
          publisher,
          pageCount,
          readPage,
          finished,
          reading,
          updatedAt,
        };

        const response = h.response({
          status: 'success',
          message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
      }
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
