const ShoppingListService = {
  getAllProducts (knex) {
    return knex.select('*').from('shopping_list')
  },
  insertProduct (knex, newProduct) {
    return knex
      .insert(newProduct)
      .into('shopping_list')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  getById(knex, id) {
    return knex.from('shopping_list').select('*').where('id', id).first()
  },
  updateProduct(knex, id, newProductFields) {
    return knex('shopping_list')
      .where({ id })
      .update(newProductFields)
  },
  deleteProduct(knex, id) {
    return knex('shopping_list')
      .where({ id })
      .delete();
  }
}

module.exports = ShoppingListService;