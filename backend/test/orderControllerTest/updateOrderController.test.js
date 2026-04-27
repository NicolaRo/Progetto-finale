//Import sinon and chai as test tools
const {expect} = require ('chai');
const sinon = require ('sinon');
const mongoose = require ('mongoose');

//Import model and controller
const Order = require('../../models/Orders');
const Product = require('../../models/Products');
const User = require('../../models/Users');
const {updateOrder} = require ('../../controllers/orderController');

const stockHelper = require('../../utils/stockHelper');

describe('Update order controller', () => {
    describe('updateOrder', ()=> {
        afterEach( ()=> {
            sinon.restore();
        });

        it('should update order status and return 200', async ()=>{
            //ARRANGE

            const fakeOrderId = new mongoose.Types.ObjectId();
            const fakeUserId = new mongoose.Types.ObjectId();

            const fakeOrder = {
                _id: fakeOrderId,
                user: fakeUserId,
                products : [
                    {
                        product: new mongoose.Types.ObjectId(),
                        orderedQuantity: 10
                    }
                ],
                containers: [],
                status: "Order created",
                save: sinon.stub().resolves()
            };

            sinon.stub(User, 'findById').resolves({_id: fakeUserId});
            sinon.stub(Order, 'findById').resolves(fakeOrder);

            const req = {
                params: {id: fakeOrderId.toString()},
                body: {
                    userId: fakeUserId.toString(),
                    status: 'Order received'
                }
            };

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            };

            //ACT
            await updateOrder(req, res);

            console.log('status calls:', res.status.args);
            console.log('json calls:', res.json.args);

            //ASSSERT
            expect(Order.findById.calledWith(fakeOrderId.toString())).to.be.true;
            expect(fakeOrder.status).to.equal('Order received');
            expect(fakeOrder.save.calledOnce).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
        });

        it('should add a new product to an order and return 200', async ()=> {
            //ARRANGE
            const fakeOrderId = new mongoose.Types.ObjectId();
            const fakeUserId = new mongoose.Types.ObjectId();
            const existingProductId = new mongoose.Types.ObjectId();
            const newProductId = new mongoose.Types.ObjectId();

            const fakeOrder = {
                _id: fakeOrderId,
                user: fakeUserId,
                products: [
                    {
                        product: existingProductId,
                        orderedQuantity: 10
                    }
                ],
                status: 'Order created',
                containers: [],
                save: sinon.stub().callsFake(async function() {
                    return this;
                })
            };

            sinon.stub(Order,'findById').resolves(fakeOrder);

            const fakeProduct = {
                _id: newProductId,
                name: 'Test Product',
                quantity: 100
            };
            sinon.stub(Product, 'findById').returns({
                session: sinon.stub().resolves(fakeProduct)
            });

            sinon.stub(Product, 'findByIdAndUpdate').resolves(fakeProduct);

            sinon.stub(stockHelper, 'updateProductStock').resolves();

            const newProducts = [
                {
                    product: newProductId.toString(),
                    orderedQuantity: 10
                }
            ];

            const req =  {
                params: {id: fakeOrderId.toString()},
                body: {
                    products: newProducts
                }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };

            //ACT
            await updateOrder(req, res);

            //ASSERT
            expect(Product.findById.called).to.be.true;
            expect(Product.findByIdAndUpdate.called).to.be.true;
            expect(fakeOrder.products.length).to.equal(2);
            expect(fakeOrder.products[1].product).to.equal(newProductId.toString());
            expect(fakeOrder.products[1].orderedQuantity).to.equal(10);
            expect(fakeOrder.save.calledOnce).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(fakeOrder)).to.be.true;
        });

        it('should update userId and return 200', async () => {
            //ARRANGE 
            const fakeOrderId = new mongoose.Types.ObjectId();
            const oldUserId = new mongoose.Types.ObjectId();
            const newUserId = new mongoose.Types.ObjectId();

            const fakeOrder = {
                _id: fakeOrderId,
                user: oldUserId,
                products: [],
                status: 'Order created',
                containers: [],
                save: sinon.stub().resolves()
            };

            sinon.stub(Order, 'findById').resolves(fakeOrder);

            sinon.stub(User, 'findById').resolves({
                _id: newUserId,
                name: 'Mario'
            });

            const req = {
                params: {id: fakeOrderId.toString()},
                body: {
                    userId: newUserId.toString()
                }
            };

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };

            //ACT
            await updateOrder(req, res);

            //ASSERT
            expect(User.findById.calledWith(newUserId.toString())).to.be.true;
            expect(fakeOrder.user.toString()).to.equal(newUserId.toString());
            expect(fakeOrder.save.calledOnce).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
        });

        it('should return 404 if order is not found', async () => {
            //ARRANGE
            const fakeOrderId = new mongoose.Types.ObjectId();
            
            sinon.stub(Order, 'findById').resolves(null);

            const req = {
                params: {id: fakeOrderId.toString()},
                body: {
                    status: 'OrderCreated'
                }
            };

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };

            //ACT
            await updateOrder(req, res);

            //ASSERT
            expect(Order.findById.calledWith(fakeOrderId.toString())).to.be.true;
            expect(res.status)
        });

        it('should return 404 if user is not found when updating userId', async () => {
            //ARRANGE
            const fakeOrderId = new mongoose.Types.ObjectId();
            const fakeUserId = new mongoose.Types.ObjectId();
            const nonExistingUserId = new mongoose.Types.ObjectId();

            const fakeOrder = {
                _id: fakeOrderId,
                user: fakeUserId,
                products: [],
                status: 'Order created',
                containers: [],
                save: sinon.stub().resolves()
            };

            sinon.stub(Order, 'findById').resolves(fakeOrder);
            sinon.stub(User, 'findById').resolves(null);

            const req = {
                params: { id: fakeOrderId.toString() },
                body: {
                    userId: nonExistingUserId.toString()
                }
            };

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };

            //ACT
            await updateOrder(req, res);

            //ASSERT
            expect(User.findById.calledWith(nonExistingUserId.toString())).to.be.true;
            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({message: 'User not found'})).to.be.true;

        });

        it('should return 500 if database fails', async () => {
            //ARRANGE
            const fakeOrderId = new mongoose.Types.ObjectId();

            sinon.stub(Order, 'findById').rejects (new Error('Database connection failed'));

            const req = {
                params: { id: fakeOrderId.toString()},
                body: {
                    status: 'Order shipped'
                }
            };

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };

            //ACT
            await updateOrder(req, res);

            //ASSERT
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({message: 'Database connection failed'})).to.be.true;
        })
    })
})