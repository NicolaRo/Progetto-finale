//Import chai and sinon as test tools
const {expect} = require ('chai');
const sinon = require ('sinon');

//Import model and controller
const productController = require ('../../controllers/productController');
const Product = require ('../../models/Products');

describe('Update Product Controller', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('should update an existing product and return 200', async()=> {
        //ARRANGE
        const req = {
            params: {id: '123fakeId'},
            body: {
                id: 1, 
                name: 'Tomatoe',
                description: 'description',
                price: [1],
                type: 'Vegetables',
                quantity: [100],
                unit: ['Kg'],
                producerId: 'fakeProducerId123'
            }
        };

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        const fakeUpdatedProduct = {
            id: 1, 
            name: 'Tomatoe',
            description: 'description',
            price: [1],
            type: 'Vegetables',
            quantity: [1000],
            unit: ['Kg'],
            producerId: 'fakeProducerId123'
        };
        const updateStub = sinon.stub (Product, 'findByIdAndUpdate').resolves(fakeUpdatedProduct);

        //ACT
        await productController.updateProduct(req, res);

        //ASSERT
        expect(updateStub.calledOnce).to.be.true;
        expect(updateStub.firstCall.args[0]).to.equal('123fakeId');
        expect(updateStub.firstCall.args[1]).to.deep.equal(req.body);
        expect(updateStub.firstCall.args[2]).to.include({new: true});

        updateStub.restore();
    });
    it('should return 404 if the product ID does not exist', async()=> {
        //ARRANGE
        const req = {
            params: {id: 'nonexistent-id'},
            body: {
                id: 1, 
                name: 'Tomatoe',
                description: 'description',
                price: [1],
                type: 'Vegetables',
                quantity: [100],
                unit: ['Kg'],
                producerId: 'fakeProducerId123'
            }
        };

        const res =  {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        const updateStub = sinon.stub(Product, 'findByIdAndUpdate').resolves(null);

        //ACT
        await productController.updateProduct(req, res);

        //ASSERT
        expect(updateStub.calledOnce).to.be.true;
        expect(updateStub.firstCall.args[0]).to.equal('nonexistent-id');
        expect(updateStub.firstCall.args[1]).to.deep.equal(req.body);
        expect(updateStub.firstCall.args[2]).to.deep.equal({new: true});
        expect(res.status.calledOnceWith(404)).to.be.true;
        expect(res.json.calledOnceWithMatch({message: 'Product not found'})).to.be.true;

        updateStub.restore();
    });
    it('should return 500 if the DB fails', async () => {
        //ARRANGE
        const req = {
            params: {id: 'nonexistent-id'},
            body: {
                id: 1, 
                name: 'Tomatoe',
                description: 'description',
                price: [1],
                type: 'Vegetables',
                quantity: [100],
                unit: ['Kg'],
                producerId: 'fakeProducerId123'
            }
        };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        const updateStub = sinon.stub(Product, 'findByIdAndUpdate').rejects(new Error('DB failure'));

        //ACT
        await productController.updateProduct(req, res);

        //ASSERT
        expect(updateStub.calledOnce).to.be.true;
        expect(res.status.calledOnceWith(500)).to.be.true;
        expect(res.json.calledOnceWithMatch({message: 'DB failure'})).to.be.true;

        updateStub.restore();
    });
});