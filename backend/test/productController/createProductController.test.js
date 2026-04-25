//Import chai and sinon as test tools
const {expect} = require ('chai');
const sinon = require('sinon');

//Import model and controller
const productController = require('../../controllers/productController');
const Product = require('../../models/Products');

describe('productController', () => {

    afterEach( ()=> {
        sinon.restore();
    });

    describe('createPRoduct', () => {
        it('should create a product and return 201', async () => {
            const req = {
                user: { id: "fakeProductId123"},
                body: {
                    name: "Cherry tomato",
                    description: "small and tasty tomato great for souces",
                    price: [1],
                    type: "vegetable",
                    quantity: [100],
                    unit: ["Kg"],
                    producerId: "fakeProducerId123"
                }
            };
            

            const fakeProduct = {
                name: "Cherry tomato",
                description: "small and tasty tomato great for souces",
                price: [1],
                type: "vegetable",
                quantity: [100],
                unit: ["Kg"],
                producerId: "fakeProducerId123",
                _id: "123fakeProductId"
            };

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            };

            const createStub = sinon.stub(Product, 'create').resolves(fakeProduct);

            //ACT
            await productController.createProduct(req, res);

            //ASSERT
            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.calledWithMatch({
                name: "Cherry tomato",
                description: "small and tasty tomato great for souces",
                price: [1],
                type: "vegetable",
                quantity: [100],
                unit: ["Kg"],
                producerId: "fakeProducerId123"
            })).to.be.true;

            createStub.restore();
        });
        it('should return 400 if required data are missing', async () => {
            //ARRANGE

            const req = {
                user: {id: "fakeProducerId123"},
                body: {
                    name: "Cherry tomato",
                    description: "small and tasty tomato great for souces",
                    price: [1],
                    type: "Vegetables",
                    //quantity is missing,
                    unit: ["Kg"],
                    producerId: "fakeProducerId123"
                }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy ()
            };

            const createStub = sinon.stub(Product, 'create');

            //ACT 
            await productController.createProduct(req, res);

            //ASSERT
            expect(res.status.calledWith(400)).to.be.true;
        });
        it('should return 500 if the DB fails', async () => {
            //ARRANGE
            const req = {
                user: {id: "fakeProducerId123"},
                body: {
                    name: "Cherry tomato",
                    description: "small and tasty tomato great for souces",
                    price: [1],
                    type: "vegetable",
                    quantity: [100],
                    unit: ["Kg"],
                    producerId: "fakeProducerId123"
                }
            };

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            };

            const createStub = sinon.stub(Product, 'create').rejects(new Error('DB failure'));

            //ACT
            await productController.createProduct(req, res);

            console.log(res.json.firstCall.args[0]);

            //ASSERT
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({message: "DB failure"})).to.be.true;

            createStub.restore();
        });
    });
});