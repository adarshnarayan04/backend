import express from "express";

const app = express();

app.get("/api/products", (req, res) => {
  const products = [
    { id: 1, name: "milk", price: 100 },
    { id: 2, name: "egg", price: 200 },
    { id: 3, name: "protein", price: 300 },
  ];
  //http://localhost:3000/api/products?search=milk
  //after ? we can write any thing ?handle=the_magician_ -->in codeforces
  //what to write after ? in frontend--> then we have to define it also in res.query

  if (req.query.search) {
    //check there is any query or not(send by frontend --> so)
    //as used ?search therefore res.query.search if use ?handle then res.query.handle
    const filteredProducts = products.filter(
      (product) =>
        product.name.toLowerCase().includes(req.query.search.toLowerCase()) //check it is in the name is present in product
    );
    //is write seach='m' it will show all products as all have m in it(milk)
    //as we are using includes mean this should be present (exact match not required)

    res.send(filteredProducts);
    return; //we should return (else will give error)
  }
  setTimeout(() => {
    res.send(products);
  }, 3000); //so that dealy can be seen(as in real world it takes time to fetch data)
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
