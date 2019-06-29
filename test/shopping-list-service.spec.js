const ShoppingListService = require('../src/shopping-list-service')
const knex = require('knex');

describe.only(`ShoppingList service object`, function(){
  let db;
  let testProducts = [
    {
      id: 1,
      name: 'First product name',
      price: "19.99",
      date_added: new Date('2029-01-24T16:28:32.615Z'),
      checked: true,
      category: 'Main',
    },
    {
      id: 2,
      price: "39.99",
      name: 'Second product name',
      date_added: new Date('2029-01-22T16:28:32.615Z'),
      checked: false,
      category: 'Lunch',
    },
    {
      id: 3,
      price: "10.99",
      name: 'Third product name',
      date_added: new Date('2029-01-25T16:28:32.615Z'),
      checked: false,
      category: 'Snack',
    },
  ]
  after(() => db.destroy())
  
  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
  })
  
  before(() => db('shopping_list').truncate())

  afterEach(() => db('shopping_list').truncate())
  
  context(`Given 'shopping_list' has data`, () => {
  beforeEach(() => {
    return db
      .into('shopping_list')
      .insert(testProducts)
  })
  
  it(`deleteArticle() removes a product by id from 'shopping_list' table`, () =>{
    const productId = 2;
    return ShoppingListService.deleteProduct(db, productId)
    .then(() => ShoppingListService.getAllProducts(db, productId))
    .then(allProducts => {
      // copy the test products array without the "deleted" product
      const expected = testProducts.filter(product => product.id !== productId)
      expect(allProducts).to.eql(expected)
    })
  })

   it(`getAllProducts() resolves all products from 'shopping_list`, () => {
     // test that ShoppingListService.getAllProducts gets data from the table
    return ShoppingListService.getAllProducts(db)
      .then(actual => {
        expect(actual).to.eql(testProducts)
      })
   })

   it(`getById() resolves a product by id from 'shopping_list' table`, () => {
     // grab the second element 
     const secondId = 2;
     // grab the second product in the testProducts array
     const secondTestProduct = testProducts[secondId - 1]
    return ShoppingListService.getById(db, secondId)
      .then(actual => {
        expect(actual).to.eql({
            id: secondId,
            price: secondTestProduct.price,
            name: secondTestProduct.name,
            date_added: secondTestProduct.date_added,
            checked: secondTestProduct.checked,
            category: secondTestProduct.category,
        })
      })
   })
   
   it(`updateProduct() updates a product from the 'shopping_list' table`, () => {
    const idOfProductToUpdate = 2;
    const newProductData = {
      name: 'Updated name',
      price: '19.99',
      checked: true,
      date_added: new Date(),
      category: 'Main'
    }

    return ShoppingListService.updateProduct(db, idOfProductToUpdate, newProductData)
      .then(() => ShoppingListService.getById(db, idOfProductToUpdate))
      .then(product => {
        expect(product).to.eql({
          id: idOfProductToUpdate,
          ...newProductData,
        })
      })
   })
 })

 context(`shopping_list has no data`, () => {
    it(`getAllProducts() resolves an empty array`, () => {
      return ShoppingListService.getAllProducts(db)
        .then(actual => {
          expect(actual).to.eql([])
        })
    })
    
    it(`insertProduct() inserts a new product and resolves the new product with an 'name', 'category', 'date_added', 'id', 'checked', and 'price'`, () =>{
      const newProduct = {
        name: 'New Product',
        checked: false,
        category: 'Breakfast',
        id: 1,
        date_added: new Date('2020-01-01T00:00:00.000Z'),
        price: "20.99", 
      }
      return ShoppingListService.insertProduct(db, newProduct)
        .then(actual => {
          expect(actual).to.eql(newProduct)
        })
    })
 }) 
})