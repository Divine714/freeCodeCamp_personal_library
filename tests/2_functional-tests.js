/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let validID = "";

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai
        .request(server)
        .post('/api/books')
        .send({ title: "Title"})
        .end(function(err, res){
        assert.equal(res.status, 200);
        assert.property(res.body, 'title');
        assert.equal(res.body.title, "Title")
        assert.property(res.body, '_id');
        
        validID = res.body._id;
        done();

        

        });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai
        .request(server)
        .post('/api/books')
        .send({})
        .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body, "missing required field title")
        done();
        });
      });
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai
        .request(server)
        .get('/api/books')
        .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount');
        assert.property(res.body[0], 'title');
        assert.property(res.body[0], '_id');
        done();
        });         
      });
    });

    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai
        .request(server)
        .get('/api/books/672815e59ce6a26e13b7b5af')
        .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body, "no book exists");
        done();
        });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai
        .request(server)
        .get('/api/books/' + validID)
        .end(function(err, res){
        assert.equal(res.status, 200);
        assert.property(res.body, '_id');
        assert.property(res.body, 'title');
        assert.property(res.body, 'comments');
        done();
        });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai
        .request(server)
        .post('/api/books/' + validID)
        .send({ comment: "comment here" })
        .end(function(err, res){
        assert.equal(res.status, 200);
        assert.property(res.body, 'title');
        assert.equal(res.body.comments[0], "comment here")
        assert.property(res.body, '_id');
        done();
      });
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai
        .request(server)
        .post('/api/books/' + validID)
        .send({})
        .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body, "missing required field comment")
        done();
      });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai
        .request(server)
        .post('/api/books/672815e59ce6a26e13b7b5af')
        .send({ comment: "comment here" })
        .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body, "no book exists")
        done();
      });
    });
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai
        .request(server)
        .delete('/api/books/' + validID)
        .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body, "delete successful")
        done();
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai
        .request(server)
        .delete('/api/books/672815e59ce6a26e13b7b5af')
        .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.text, "no book exists")
        done();
      });

      });
    });
  });

});
});
