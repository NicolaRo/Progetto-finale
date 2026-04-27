//Import Chai and Sinon as test tools
const {expect} = require ('chai');
const sinon = require ('sinon');
const mongoose = require ('mongoose');

//Import models and controller
const Order = require ('../../models/Orders');
const Product = require ('../../models/Products');
const {deleteOrder} = require('../../controllers/orderController');
const stockHelper = require ('../../utils/stockHelper');

describe('Delete order controller', () => {
    describe('deleteOrder',  () => {
        afterEach( () => {
            sinon.restore();
        });
        it('should delete order, restore stock and return 204', async () => {
            //ARRANGE
            const fakeOrderId = new mongoose.Types.ObjectId();
            const fakeProductId1 = new mongoose.Types.ObjectId();
            const fakeProductId2 = new mongoose.Types.ObjectId();

            

            const fakeOrder = {
                _id: fakeOrderId,
                products:  [
                    {
                        product: fakeProductId1,
                        orderedQuantity: 5
                    },
                    {
                        product: fakeProductId2,
                        orderedQuantity: 10
                    }
                ],
                status: 'Order created',
                containers: []
            };

            const findByIdStub = sinon.stub(Order, 'findById').resolves(fakeOrder);

            sinon.stub(Product, 'findByIdAndUpdate').resolves();

            const findByIdAndDeleteStub = sinon.stub(Order, 'findByIdAndDelete').returns({
                session: sinon.stub().resolves()
            });
            
            const req = {
                params: {id: fakeOrderId.toString()}
            };

            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub(),
                json: sinon.stub()
            };

            sinon.stub(Product, 'findById').resolves({
                _id: fakeProductId1,
                quantity: 100
            });

            //ACT
            await deleteOrder(req, res);

            //ASSERT
    
            expect(Product.findByIdAndUpdate.callCount).to.equal(2);
            expect(Product.findByIdAndUpdate.firstCall.calledWith(fakeProductId1, {$inc: {quantity: 5}})).to.be.true;
            expect(Product.findByIdAndUpdate.secondCall.calledWith(fakeProductId2, {$inc: {quantity: 10}})).to.be.true;
            expect(findByIdAndDeleteStub.calledWith(fakeOrderId.toString())).to.be.true;
            expect(res.status.calledWith(204)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
        });

        it('should return 500 if DB fails', async ()=> {
            //ARRANGE
            const fakeOrderId = new mongoose.Types.ObjectId();

            sinon.stub(Order, 'findById').rejects(new Error('DB Failure'));
            

            const req = {
                params: {id: fakeOrderId.toString()}
            };

            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub(),
                json: sinon.stub()
            };

            //ACT
            await deleteOrder(req, res);

            //ASSERT
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({message: 'DB Failure'})).to.be.true;
        });
    });
});