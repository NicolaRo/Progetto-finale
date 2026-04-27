//Import Chai and Sinon as test tools
const {expect} = require ('chai');
const sinon = require ('sinon');

//Import model and controller
const Containers = require ('../../models/Containers');
const containerController = require ('../../controllers/containerController');

describe('update container controller', () => {
    afterEach(()=> {
        sinon.restore();
    });

    it('should update an existing container and return 200', async()=> {
        //ARRANGE
        const fakeContainer = {
            _id: '123fakeId',
            type: "Sealed",
            state: "Container ready to use",
            save: sinon.stub().resolves()
        };

        const updateStub = sinon.stub(Containers, 'findById').resolves(fakeContainer);

        const req = {
            params: {id: '123fakeId'},
            body: {state: "Container busy"},
            user: {role: "Producer"}
        };


        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        const fakeUpdatedContainer =  {
            _id: '123fakeId',
            type:"Sealed",
            state: "Container busy"
        };

        //ACT
        await containerController.updateContainer(req, res);

        //ASSERT
        expect(updateStub.calledOnceWith('123fakeId')).to.be.true;
        expect(fakeContainer.state).to.equal('Container busy');
        expect(fakeContainer.save.calledOnce).to.be.true;
        expect(res.status.calledWith(200)).to.be.true;

        updateStub.restore();
    });

    it('should return 404 if the product ID does not exist', async ()=> {
        //ARRANGE
        const req = {
            params: {id: 'nonexistent-id'},
            body: {
                type: "Sealed",
                state: "Container ready to use"
            }
        };

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        const updateStub = sinon.stub(Containers, 'findById').resolves(null);

        //ACT
        await containerController.updateContainer(req, res);

        //ASSERT
        expect(updateStub.calledOnce).to.be.true;
        expect(updateStub.calledOnceWith('nonexistent-id')).to.be.true;
        expect(res.status.calledOnceWith(404)).to.be.true;
        expect(res.json.calledOnceWithMatch({message: 'Container not found'})).to.be.true;

        updateStub.restore();
    });

    it('should return 500 if the DB fails', async ()=> {
        //ARRANGE
        const req = {
            params: {id: '123fakeId'},
            body: {
                type: "Sealed",
                state: "Container ready to use" 
            }
        };

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        const updateStub = sinon.stub(Containers, 'findById').rejects(new Error ('DB failure'));

        //ACT
        await containerController.updateContainer(req, res);

        //ASSERT
        expect(updateStub.calledOnce).to.be.true;
        expect(res.status.calledOnceWith(500)).to.be.true;
        expect(res.json.calledOnceWithMatch({message: 'DB failure'})).to.be.true;

        updateStub.restore();
    });
});
