//Import chai and sinon as test tools
const {expect} = require ('chai');
const sinon = require ('sinon');

//Import model and controller
const productController = require ('../../controllers/productController');
const Product = require ('../../models/Products');

describe('ProductController', () => {

    describe('getProducts', () => {

        afterEach(() => {
            sinon.restore();
        });

        it('should return 200 and an array of products when DB  call succeeds', async () => {
            //ARRANGE
            const fakeProducts = [{
                id: 1, 
                name: 'Tomatoe',
                description: 'description',
                price: [1],
                type: 'Vegetables',
                quantity: [100],
                unit: ['Kg'],
                producerId: 'fakeProducerId123'
            }];

            const findStub = sinon.stub(Product, 'find').resolves(fakeProducts);

            const req = {query: {} };

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            };

            //ACT
            await productController.getProducts(req, res);

            //ASSERT
            expect(findStub.calledOnce).to.be.true;
            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.json.calledOnceWithMatch(fakeProducts)).to.be.true;
        });
        it('should return 404 failing to find Product searched with the ID', async() => {
            //ARRANGE
            const findByIdStub = sinon.stub(Product, 'findById').resolves(null);

            const req = {
                params: {id: 'nonexistent-id'}
            };

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            };

            //ACT
            await productController.getProductById(req, res);

            //ASSERT
            expect(findByIdStub.calledOnceWith('nonexistent-id')).to.be.true;
            expect(res.status.calledOnceWith(404)).to.be.true;
            expect(res.json.calledOnceWithMatch({message: 'Product not found'})).to.be.true;
        });
        it('should return 500 when DB comunication break down', async () => {
            //ARRANGE
            const findStub = sinon.stub(Product, 'find').rejects(new Error('DB failure'));

            const req = {query: {}};

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            };

            //ACT
            await productController.getProducts(req, res);

            //ASSERT
            expect(findStub.calledOnce).to.be.true;
            expect(res.status.calledOnceWith(500)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.firstCall.args[0]).to.have.property('message', 'DB failure');
        });
    });
});