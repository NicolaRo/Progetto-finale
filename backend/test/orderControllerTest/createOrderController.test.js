//Import chai sinon and mongoose
const {expect} = require ('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

//Import model and controller
const orderController = require ('../../controllers/orderController');
const Order = require('../../models/Orders');
const Product = require('../../models/Products');
const User = require('../../models/Users');
const {createOrder} = require('../../controllers/orderController');

describe('Order Controller', () => {
    describe('createOrder', () => {
        afterEach(() => {
            sinon.restore();
        });
        it('should create a new order and return 201', async () => {

            //ARRANGE - create valid ID for MongoDB
            const fakeUserId = new mongoose.Types.ObjectId();
            const fakeProductId = new mongoose.Types.ObjectId();
            const fakeOrderId = new mongoose.Types.ObjectId();

            //pretend the User exist in the DB
            sinon.stub(User, 'findById').resolves ({
                _id: 'fakeUserId',
                name: "Mario",
                surname: "Rossi",
                email: "mario@example.com",
                password: "AzAGROrtoFelice",
                role: "Producer"
            });

           
            const fakeProductQuery = {
                    _id: 'fakeProductId',
                    name: 'Tomatoe',
                    description: 'description',
                    price: [1],
                    type: 'Vegetables',
                    quantity: [100],
                    unit: ['Kg'],
                    producerId: 'fakeProducerId123'
                };

            sinon.stub(Product, 'findById').returns(fakeProductQuery);

            //stock update simulation
            sinon.stub(Product, 'findByIdAndUpdate').resolves({
                _id: 'fakeProductId',
                name: 'Tomatoe',
                description: 'description',
                price: [1],
                type: 'Vegetables',
                quantity: [10], //Quantity after update
                unit: ['Kg'],
                producerId: 'fakeProducerId123'
            });

            //Order create simulation
            sinon.stub(Order, 'create').resolves([
                {
                    _id: 'fakeOrderId',
                    user: 'fakeUserId',
                    products: [
                        {
                            product: fakeProductId,
                            orderedQuantity: 90
                        }
                    ],
                    status: 'Order created',
                    createdAt: new Date()
                }
            ]);

            //The HTTP Request reach the controller
            const req = {
                body: {
                    userId: fakeUserId.toString(),
                    products:[
                        {
                            product: fakeProductId.toString(),
                            orderedQuantity: 90
                        }
                    ],
                    containers: [],
                    state: "Order created"
                }
            };

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };

            //ACT
            await createOrder(req,res);
            //ASSERT
            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.called).to.be.true;
            expect(User.findById.calledWith(fakeUserId.toString())).to.be.true;
            expect(Product.findById.calledWith(fakeProductId.toString())).to.be.true;
            expect(Product.findByIdAndUpdate.called).to.be.true;
        });
        it('should return 400 if userId or products are missing', async () => {
            //ARRANGE
            const req = {
                body: {
                    //Missing userId
                    products: []
                }
            };

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
            //ACT 
            await createOrder(req,res);

            //ASSERT
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({message: 'Order details missing or not valid'})).to.be.true;
        })
        it('should return 400 if product array is empty', async () => {
            //ARRANGE
            const req = {
                body: {
                    userId: new mongoose.Types.ObjectId().toString(),
                    products: [] //Empty array
                }
            };

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };

            //ACT
            await createOrder(req, res);

            //ASSERT
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({message: 'Order details missing or not valid'})).to.be.true;
        });
        it ('should return 404 if user not found', async () => {
            //ARRANGE
            const fakeUserId = new mongoose.Types.ObjectId();
            const fakeProductId = new mongoose.Types.ObjectId();

            sinon.stub(User, 'findById').resolves(null);

            const req = {
                body: {
                    userId: fakeUserId.toString(),
                    products: [
                        {
                            product: fakeProductId.toString(),
                            orderedQuantity: 2
                        }
                    ],
                    containers: [],
                    state: "Order created"
                }
            };

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };

            //ACT
            await createOrder(req, res);

            //ASSERT
            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({message: 'User not found'})).to.be.true;
        });
        it('should return 400 if a product has invalid orderedQuantity', async () => {
            //ARRANGE
            const fakeUserId = new mongoose.Types.ObjectId();
            const fakeProductId = new mongoose.Types.ObjectId();

            const req = {
                body: {
                    userId: fakeUserId.toString(),
                    products: [
                        {
                            product: fakeProductId.toString(),
                            orderedQuantity: -5 //Negative quantity is not valid
                        }
                    ],
                    containers: [],
                    state: "Order created"
                }
            };

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };

            //ACT
            await createOrder(req,res);

            //ASSERT
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({
                message: 'Every product must have a valid ID and positive quantity'
            })).to.be.true;
        });
    });
});