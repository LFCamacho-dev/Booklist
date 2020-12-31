// Book class: Represents a book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();

    books.push(book);

    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}

// UI class: handle ui tasks
class UI {
  static displayBooks() {

    const books = Store.getBooks();

    books.forEach((book) => UI.addBookToList(book));

  }

  static addBookToList(book) {
    const list = document.querySelector('#book-list');

    const row = document.createElement('tr');

    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `;
    list.appendChild(row);
  }

  // static deleteBook(el) {
  //   if (el.classList.contains('delete')) {
  //     el.parentElement.parentElement.remove();
  //   }
  // }
  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    const paragraph = document.createElement('p');
    //paragraph.innerText = `${message}`;

    const container = document.querySelector('.container');

    const form = document.querySelector('#book-form');

    div.appendChild(document.createTextNode(message));


    container.insertBefore(div, form);

    //form.appendChild(div);

    setTimeout(() => { container.removeChild(div) }, 3000);

  }

}
//store class: handle storage

//event - display book

if (document.readyState !== 'loading') {
  UI.displayBooks();
  console.log('Ready State!');
} else {
  document.addEventListener('DOMContentLoaded', UI.displayBooks);
  console.log('DOM Loaded state!');
}

//event - add book 
document.querySelector('#book-form').addEventListener('submit', (e) => {

  //prevent submit
  e.preventDefault;
  //get form values
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;

  // instantiate book

  if (title.trim() != '' && author.trim() != '' && isbn.trim() != '') {
    const book = new Book(title, author, isbn);

    UI.addBookToList(book);

    Store.addBook(book);

    document.querySelector('#book-form').reset();

    UI.showAlert('Book added!', 'success');

  } else {
    // alert('Please fill in all fields');
    UI.showAlert('Please fill in all fields', 'danger');
  }

});


//event - remove book

document.querySelector('#book-list').addEventListener('click', (el) => {
  if (el.target.classList.contains('delete')) {
    el.target.parentElement.parentElement.remove();

    Store.removeBook(el.target.parentElement.previousElementSibling.textContent);
    UI.showAlert('Book deleted', 'warning');
  }
}
);
