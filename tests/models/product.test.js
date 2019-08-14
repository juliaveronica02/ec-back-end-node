var chai = require('chai')
var sinon = require('sinon')
chai.use(require('sinon-chai'))
const request = require('supertest')
const { expect } = require('chai')

const app = require('../../app')
const db = require('../../models')
const ProductModel = require('../../models/product')

const {
  sequelize,
  dataTypes,
  checkModelName,
  checkUniqueIndex,
  checkPropertyExists
} = require('sequelize-test-helpers')

describe('# Product Model', () => {
  const Product = ProductModel(sequelize, dataTypes)
  const product = new Product()

  checkModelName(Product)('Product')

  context('Properties', () => {
    ;[
      'name',
      'image',
      'description',
      'stock_quantity',
      'cost_price',
      'origin_price',
      'sell_price',
      'product_status'
    ].forEach(checkPropertyExists(product))
  })

  context('Associations', () => {
    const Cart = 'Cart'
    const Order = 'Order'
    const CartItem = 'CartItem'

    before(() => {
      Product.associate({ Cart })
      Product.associate({ Order })
    })

    it('defined a belongsToMany association with cart', () => {
      expect(Product.belongsToMany).to.have.been.calledWith(Cart)
    })
    it('defined a belongsToMany association with order', () => {
      expect(Product.belongsToMany).to.have.been.calledWith(Order)
    })
  })

  describe('CRUD', () => {
    let data = null

    it('create', done => {
      db.Product.create({}).then(user => {
        data = user
        done()
      })
    })
    it('read', done => {
      db.Product.findByPk(data.id).then(user => {
        expect(data.id).to.be.equal(user.id)
        done()
      })
    })
    it('update', done => {
      db.Product.update({}, { where: { id: data.id } }).then(() => {
        db.Product.findByPk(data.id).then(user => {
          expect(data.updatedAt).to.be.not.equal(user.updatedAt)
          done()
        })
      })
    })
    it('delete', done => {
      db.Product.destroy({ where: { id: data.id } }).then(() => {
        db.Product.findByPk(data.id).then(user => {
          expect(user).to.be.equal(null)
          done()
        })
      })
    })
  })
})
