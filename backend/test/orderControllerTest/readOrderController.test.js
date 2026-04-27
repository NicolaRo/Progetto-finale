//Import chai and sinon as test tools
const {expect} = require('chai');
const sinon = require('sinon');

//Import model and controller
const orderController = require ('../../controllers/orderController');
const Order = require ('../../models/Orders');

describe ('Order controller', () => {
    describe('getOrders', () => {
        
        afterEach(() => {
            sinon.restore();
        });

        it('should return 200 and an array of orders when DB call succeeds', async () => {
            //ARRANGE
            const fakeOrders = [{id: 1}, {id: 2}, {id: 3}];
            
            const findStub = sinon.stub(Order, 'find').returns({
                populate: sinon.stub().returns({
                    populate: sinon.stub().resolves(fakeOrders)
                })
            });
        
            const req = {query: {}};

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            };

            //ACT
            await orderController.getOrders(req, res);


            console.log('status calls:', res.status.args);
            
            console.log('json calls:', res.json.args);
            
            //ASSERT
            expect(findStub.calledOnce).to.be.true;
            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.json.calledOnceWithMatch(fakeOrders)).to.be.true;
        });

        it('should return 200 and an empty array if there are no orders in the DB', async () => {
            //ARRANGE
            const findStub = sinon.stub(Order, 'find').returns({
                populate: sinon.stub().returns({
                    populate: sinon.stub().resolves([])
                })
        });

        const req = {
            query: {}
        };

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        //ACT
        await orderController.getOrders(req, res);

        //ASSERT
        expect(findStub.calledOnce).to.be.true;
        expect(res.status.calledOnceWith(200)).to.be.true;
        expect(res.json.calledWithMatch([])).to.be.true;
        });

        it('should return 500 if the DB fails', async () => {

            const findStub = sinon.stub(Order, 'find').throws(new Error('DB failure'));

            const req = { query: {}};

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            };

            //ACT
            await orderController.getOrders(req, res);

            //ASSERT
            expect(findStub.calledOnce).to.be.true;
            expect(res.status.calledOnceWith(500)).to.be.true;
            expect(res.json.calledOnceWithMatch({message: 'DB failure'})).to.be.true;
        });

        it('should return 200 and orders filtered by date', async () => {

            //ARRANGE
            const fakeOrders = [{ id: 1, createdAt: '2026-02-11'}];

            const findStub = sinon.stub(Order, 'find').returns({
                populate: sinon.stub().returns({populate: sinon.stub().resolves(fakeOrders)})
            });

            const req = {query: {date: '2026-02-11'}};
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            };

            //ACT
            await orderController.getOrders(req, res);

            //ASSERT
            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.json.calledOnceWithMatch(fakeOrders)).to.be.true;
        });

        it('should return 200 and an empty array if no orders are registered on a specific date', async () => {
            //ARRANGE
            const findStub = sinon.stub(Order, 'find').returns({
                populate: sinon.stub().returns({populate: sinon.stub().resolves([])})
            });

            const req = {query: {date: '2026-02-12'}};
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            };

            //ACT
            await orderController.getOrders(req, res);

            //ASSERT
            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.json.calledOnceWithMatch([])).to.be.true;
        });

        it('should return 200 and orders filtered by userId', async () => {
            //ARRANGE
            const fakeOrders = [{id: '123fakeUserId'}];

            const findStub = sinon.stub(Order, 'find').returns({
                populate: sinon.stub().returns({populate: sinon.stub().resolves(fakeOrders)})
            });

            const req = {query: {userId: '123fakeUserId'}};

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            };

            //ACT
            await orderController.getOrders(req, res);

            //ASSERT
            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.json.calledOnceWithMatch(fakeOrders)).to.be.true;
        });

        it('should return 200 and an empty array if user has no orders', async() => {
            //ARRANGE
            const findStub = sinon.stub(Order, 'find').returns({
                populate: sinon.stub().returns({populate: sinon.stub().resolves([]) })
            });

            const req = {query: {userId: 'nonexsisting-Id'}};
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            };

            //ACT
            await orderController.getOrders(req, res);

            //ASSERT
            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.json.calledOnceWithMatch([])).to.be.true;
        });

        it('should return 200 and orders filtered by productId', async() => {
            //ARRANGE
            const fakeOrders = [{id: '123fakeProductId'}];

            const findStub = sinon.stub(Order, 'find').returns({
                populate: sinon.stub().returns({
                    populate: sinon.stub().resolves(fakeOrders)
                })
            });

            const req = { query: {_id: '123fakeProductId'}};
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            };

            //ACT
            await orderController.getOrders(req, res);

            //ASSERT
            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.json.calledOnceWithMatch(fakeOrders)).to.be.true;
        });

        it('should return 200 and an empty array if no orders contain that product', async () => {
            //ARRANGE
            const findStub= sinon.stub(Order, 'find').returns({
                populate: sinon.stub().returns({
                    populate: sinon.stub().resolves([]) })
        });

        const req = {query: {_id: 'nonexsisting-id'}};
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        //ACT
        await orderController.getOrders(req, res);

        //ASSERT
        expect(res.status.calledOnceWith(200)).to.be.true;
        expect(res.json.calledOnceWithMatch([])).to.be.true;
    });
});
});