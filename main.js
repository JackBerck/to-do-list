// variable dasar //done
 const books = [];
 const RENDER_EVENT = 'render-book';
 const SAVED_EVENT = 'saved-book';
 const STORAGE_KEY = 'BOOK_APPS';
 
// men-generate id secara random //done
 function generateId() {
   return +new Date();
 }

//  men-generate bookshelf list //done
 function generateBookObject(id, title, author, year, isCompleted) {
   return {
     id,
     title,
     author,
     year,
     isCompleted
   }
 }
 
 // mencari buku untuk mengeksekusi(hapus, pindah) //done
 function findBook(bookId) {
   for (const bookItem of books) {
     if (bookItem.id === bookId) {
       return bookItem;
     }
   }
   return null;
 }

//  mencari index buku //done
 function findBookIndex(bookId) {
   for (const index in books) {
     if (books[index].id === bookId) {
       return index;
     }
   }

   return -1;
 }
 
//  mengecek browser men-support local storage //done
 function isStorageExist() {
   if (typeof (Storage) === undefined) {
     alert('Maaf, browser kamu belum mendukung local storage');
     return false;
   }
   return true;
 }
 
//  menyimpan data //done
 function saveData() {
   if (isStorageExist()) {
     const parsed = JSON.stringify(books);
     localStorage.setItem(STORAGE_KEY, parsed);
     document.dispatchEvent(new Event(SAVED_EVENT));
   }
 }
 
//  menampilkan data dari localStorage //done
 function loadDataFromStorage() {
   const serializedData = localStorage.getItem(STORAGE_KEY);
   let data = JSON.parse(serializedData);
 
   if (data !== null) {
     for (const book of data) {
       books.push(book);
     }
   }
 
   document.dispatchEvent(new Event(RENDER_EVENT));
 }
 
//  membuat elemen-elemen yang ada dalam book //done
 function makeBook(bookObject) {
   const {id, title, author, year, isCompleted} = bookObject;
 
   const bookTitle = document.createElement('h3');
   bookTitle.innerText = title;
 
   const bookAuthor = document.createElement('p');
   bookAuthor.innerText = `Author: ${author}`;

   const bookYear = document.createElement('p');
   bookYear.innerText = `Year: ${year}`;
   
   const action = document.createElement('div');
   action.classList.add('action');
 
   const bookContainer = document.createElement('article');
   bookContainer.classList.add('book_item');
   bookContainer.setAttribute('id', bookObject.id);
   bookContainer.append(bookTitle, bookAuthor, bookYear, action);

   if (isCompleted) {
    const undoButton = document.createElement('button');
    undoButton.innerText = 'Unfinished';
    undoButton.classList.add('green');
    undoButton.addEventListener('click', function () {
      undoBookFromCompleted(id);
    });

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.classList.add('red');
    deleteButton.addEventListener('click', function () {
      deleteBook(id);
    });

    action.append(undoButton, deleteButton);
  } else {
    const checkButton = document.createElement('button');
    checkButton.innerText = 'Finished';
    checkButton.classList.add('green');
    checkButton.addEventListener('click', function () {
      addBookToCompleted(id);
    });

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.classList.add('red');
    deleteButton.addEventListener('click', function () {
      deleteBook(id);
    });

    action.append(checkButton, deleteButton);
  }
   return bookContainer;
 }
 
 // menambahkan buku //done
 function addBook() {
   const bookTitle = document.getElementById('inputBookTitle').value;
   const bookAuthor = document.getElementById('inputBookAuthor').value;
   const bookYear = document.getElementById('inputBookYear').value;
   const checkBox = document.getElementById('inputBookIsComplete').checked;
 
   const generatedID = generateId();
   const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, checkBox);
   books.push(bookObject);
 
   document.dispatchEvent(new Event(RENDER_EVENT));
   saveData();
 }
 
//  menambahkan buku ke rak sudah dibaca //done
 function addBookToCompleted(bookId) {
   const bookTarget = findBook(bookId);
 
   if (bookTarget == null) return;
 
   bookTarget.isCompleted = true;
   document.dispatchEvent(new Event(RENDER_EVENT));
   saveData();
 }
 
//  menghapus buku //done
 function deleteBook(bookId) {
   const bookTarget = findBookIndex(bookId);
 
   if (bookTarget === -1) return;
 
   books.splice(bookTarget, 1);
   document.dispatchEvent(new Event(RENDER_EVENT));
   saveData();
 }
 
//  mengembalikan buku ke rak belum dibaca //done
 function undoBookFromCompleted(bookId) {
   const bookTarget = findBook(bookId);
   if (bookTarget == null) return;
 
   bookTarget.isCompleted = false;
   document.dispatchEvent(new Event(RENDER_EVENT));
   saveData();
 }

 //mencegah web refresh ketika submit //done
 document.addEventListener('DOMContentLoaded', function () {
   const submitBook = document.getElementById('inputBook');
 
   submitBook.addEventListener('submit', function (event) {
     event.preventDefault();
     addBook();
   });
 
   if (isStorageExist()) {
     loadDataFromStorage();
   }
 });
 
 document.addEventListener(SAVED_EVENT, function() {
    console.log(localStorage.getItem(STORAGE_KEY));
 }); 

//  rendering web page //done
 document.addEventListener(RENDER_EVENT, function () {
   const uncompletedBookList = document.getElementById('incompleteBookshelfList');
   const completedBookList = document.getElementById('completeBookshelfList');
 
   // clearing list item
   uncompletedBookList.innerHTML = '';
   completedBookList.innerHTML = '';
 
   for (const bookItem of books) {
     const bookElement = makeBook(bookItem);
     if (bookItem.isCompleted) {
      completedBookList.append(bookElement);
     } else {
      uncompletedBookList.append(bookElement);
     }
   }
 });