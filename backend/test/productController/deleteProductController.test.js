//Import chai and sinon as test tools
const {expect} = require ('chai');
const sinon = require ('sinon');

//Import model and controller
const productController = require ('../../controllers/productController');
const Product = require('../../models/Products');

describe('Product Controller - deleteProduct', () => {
    let deleteStub;
    afterEach(() =>{
        if(deleteStub) deleteStub.restore();
    });

    it('should delete an existing product', async () => {
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

        const deleteProduct = {
            _id: 'fakeProductId123',
            id: 1, 
            name: 'Tomatoe',
            description: 'description',
            price: [1],
            type: 'Vegetables',
            quantity: [100],
            unit: ['Kg'],
            producerId: 'fakeProducerId123'
        };

        deleteStub = sinon.stub(Product, 'findByIdAndDelete').resolves(deleteProduct);

        //ACT
        await productController.deleteProduct(req, res);

        //ASSERT
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
        expect(deleteStub.calledOnceWith(req.params.id)).to.be.true;
    });
    it('should return 404 if a product is not found', async() => {
        //ARRANGE
        const req = {
            params: {
                id: 'nonexistent-id'
            }
        };

        const res ={
            status: sinon.stub().returnsThis(),

            json: sinon.spy()
        };

        deleteStub = sinon.stub(Product, 'findByIdAndDelete').resolves(null);

        //ACT
        await productController.deleteProduct(req,res);

        //ASSERT
        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
        expect(deleteStub.calledOnceWith(req.params.id)).to.be.true;
    });

    it('should return 500 if DB fails', async () => {
        //ARRANGE
        const req = {
            params :{
                id: 'anyId'
            }
        };

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        deleteStub = sinon.stub(Product, 'findByIdAndDelete').rejects(new Error('DB Error'));

        //ACT
        await productController.deleteProduct(req, res);

        //ASSERT
        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
    });
});