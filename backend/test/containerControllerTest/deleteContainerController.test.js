//Import Chai and Sinon as test tools
const {expect} = require ('chai');
const sinon = require ('sinon');

//Import models and controller
const Containers = require ('../../models/Containers');
const {deleteContainer} = require ('../../controllers/containerController');

describe('Container controller', () => {
    let deleteStub;

    afterEach (() => {
        if(deleteStub)
            deleteStub.restore();
    });

    it('should delete an existing container', async () => {
        //ARRANGE
        const req = {
            params: {
                id: 'fakeContainerId123',
                type: "Sealed",
                status: "Container ready to use"
            }
        };

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        deleteStub = sinon.stub(Containers, 'findByIdAndDelete').resolves(deleteContainer);


        //ACT
        await deleteContainer(req, res);

        //ASSERT
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
        expect(deleteStub.calledOnceWith(req.params.id)).to.be.true;
    });

    it('should return 404 if a product is not found', async ()=> {
        const req = {
            params: {
                id: 'nonExistingId123'
            }
        };

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        deleteStub = sinon.stub(Containers, 'findByIdAndDelete').resolves(null);

        //ACT
        await deleteContainer(req, res);

        //ASSERT
        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
        expect(deleteStub.calledOnceWith(req.params.id)).to.be.true;
    });

    it('should return 500 if DB fails', async () => {
        const req = {
            params: {
                id: 'anyId'
            }
        };

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        deleteStub = sinon.stub(Containers, 'findByIdAndDelete').rejects(new Error ('DB Error'));

        //ACT
        await deleteContainer(req, res);

        //ASSERT
        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
    });
});