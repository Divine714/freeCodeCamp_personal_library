/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const bookModel = require("../models").bookModel;

module.exports = function (app) {

  app.route('/api/books')
    .get(async (req, res) => {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      try {
        const findBooks = await bookModel.find({});
        if(!findBooks) {
          res.json("no book data currently saved")
        } else {
          const mapBooks = await findBooks.map((book) => {
            return {
              title: book.title,
              _id: book._id,
              commentcount: book.comments.length,
              comments: book.comments,
            };
          })
          res.json(mapBooks);
        }
      } catch (error) {
        console.error(error);
        res.json("could not retrieve book data")
      }
    })
    
    .post(async (req, res) => {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if(!title){
        res.json("missing required field title");
      } else {
        try {
        const createBook = new bookModel({
          title: title,
          comments: [],
        })
        const saveBook = await createBook.save();

        res.json({
          title: saveBook.title,
          _id: saveBook._id
        })

        } catch (error) {
          console.error(error)
          res.json("could not add book")
        }
      }
    })
    
    .delete(async (req, res) => {
      //if successful response will be 'complete delete successful'
     try{
      const removeAll = await bookModel.deleteMany({});
      res.json("complete delete successful");
     } catch (error) {
      console.error(error);

     }
    });



  app.route('/api/books/:id')
    .get(async (req, res) => {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      try{
        const findBook = await bookModel.findOne({ _id: bookid });
        if (!findBook) {
          res.json("no book exists");
        } else {
            res.json(findBook)
          }
      } catch (error) {
        console.error(error);
        res.json("no book exists")
      }
      
    })
    
    .post(async (req, res) => {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      try {
        let findBook = await bookModel.findOne({ _id: bookid });
        if(!findBook) {
          res.json("no book exists");
        } else {
          if(!comment) {
            res.json("missing required field comment")
          } else {
            findBook.comments.push(comment);
          const saveUpdate = await findBook.save();
          res.json({
            title: saveUpdate.title,
            _id: saveUpdate._id,
            commentcount: saveUpdate.comments.length,
            comments: saveUpdate.comments,
          })
          }
          
        }
      } catch (error) {
        console.error(error);
        res.json("no book exists")
      }

    })
    
    .delete(async (req, res) => {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      try{
        const findBook = await bookModel.findOne({ _id: bookid });
        if(!findBook) {
          res.json("no book exists")
        } else {
          const deleteBook = await bookModel.findOneAndDelete({ _id: bookid });
          res.json("delete successful")
        }
      } catch (error){
        console.error(error);
        res.json("could not delete")
      }
    });
  
};
