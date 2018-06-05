const express = require('express');
const router = express.Router();
const fs = require('fs');

let nextId = 5

let beersList = [];

fs.readFile('./beers.json', 'utf8', function(err, data){
  if (err){
    throw err;
  }
  beersList = JSON.parse(data);
});


router.param('beer', (request, response, next, id) => {
request.beer = beersList.beers.find(beer => beer.id === id)
next();
});

router.param('review', (request, response, next, reviewIndex) => {
request.review = request.beer.reviews[reviewIndex];
next();
});


router.get('/', (request, response, next) => {
  response.set({"Content-Type": "application/json"});
 return response.send(JSON.stringify(beersList.beers));
});

router.get('/:beer', (request, response) => {
 return response.send(`The beer id you requested is ${request.beer.name}`);
});

router.get('/:beer/reviews', (request, response) => {
 return response.send(JSON.stringify(request.beer.reviews));
});

router.get('/:beer/reviews/:review', (request, response) =>{
   return response.send(JSON.stringify(request.review))
});
//create new beer
router.post('/', (request, response) => {
 let newBeer = request.body;
  if(newBeer.name){
    newBeer.id = nextId.toString();
    nextId ++
    if(newBeer.reviews){
      newBeer.reviews = [request.body.reviews];
      beersList.beers.push(newBeer);
      response.set({"Content-Type": "application/json"})
      return response.send(JSON.stringify(newBeer))
    }
    else {
      newBeer.reviews = [];
      beersList.beers.push(newBeer);
      response.set({"Content-Type": "application/json"})
      return response.send(JSON.stringify(newBeer))
    }
}
else {
  response.writeHead(400, 'Beer name not sent in body')
  return response.send()
}
});

router.post('/:beer/reviews', (request, response) => {
  let newReview = request.body;
  if(newReview){
    request.beer.reviews.push(newReview);
    response.set({"Content-Type": "application/json"});
    return response.send(JSON.stringify(request.beer))
  }
  else {
    response.writeHead(400, "Review not sent in body");
    return response.send()
  }
});

router.put('/:beer', (request, response) => {
 let updatedBeer = request.body;
 if(updatedBeer.name){
    request.beer.name = updatedBeer.name;
    response.set({"Content-Type": "application/json"});
    return response.send(JSON.stringify(updatedBeer));
 }
 else {
   response.writeHead(400, "Updated Beer name not sent REQUIRED");
   response.send();
 }
});

router.put('/:beer/reviews/:review', (request, response) => {
 let requestedReview = request.review;
 let submittedUpdate = request.body;
 if(requestedReview && submittedUpdate){
     requestedReview.text = submittedUpdate.text;
     if(requestedReview.text){
     response.set({"Content-Type": "application/json"});
     return response.send(JSON.stringify(requestedReview))
    }
    else {
      response.status(400);
      return response.send()
    }
 }
 else {
   response.status(400);
   return response.send()
 }
});

router.delete('/:beer', (request, response) => {
  if(request.beer){
  let requestedBeer = request.beer;
  let beerIndex = beersList.beers.findIndex((beer) => {
    return beer.id == requestedBeer.id;
  });
  if(beerIndex !== -1){
  beersList.beers.splice(beerIndex,1)
  response.set({"Content-Type": "application/json"});
  response.send(JSON.stringify(beersList.beers))
    }
    else {
      response.status(400).send()
    }
  }
  else{
    response.status(400).send()
  }
});

router.delete('/:beer/reviews/:review',(request, response) => {
  if(request.beer && request.review){
  let reviewIndex = request.beer.reviews.findIndex((review) => {
    return review.text = request.review.text;
  })
  request.beer.reviews.splice(reviewIndex,1);
  let updatedBeer = request.beer.reviews;
  response.set({"Content-Type":"application/json"});
  response.send(updatedBeer);
  }
})
module.exports = router;
