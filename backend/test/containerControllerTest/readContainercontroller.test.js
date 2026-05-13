//Import Chai and Sinon as test tools
const {expect} = require ('chai');
const sinon = require ('sinon');

//Import model and controller
const Container = require ('../../models/Containers');
const containerController = require ('../../controllers/containerController');

describe('containerController', () => {
    describe ('getContainer', ()=> {
        afterEach(()=>{
            sinon.restore();
        });

        it('should return 2200 and an array of containers when DB call succeeds', async ()=> {
            const fakeContainer = [{
                id: 1,
                type:"Sealed",
                status: "Container busy"
            }];

            const findStub = sinon.stub(Container, 'find').resolves(fakeContainer);

            const req = { query: {}};

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            };

            //ACT
            await containerController.getContainers(req, res);

            //ASSERT
            expect(findStub.calledOnce).to.be.true;
            expect(res.json.calledOnceWithMatch(fakeContainer)).to.be.true;
        });

        it('should return 404 failing to find a container with specific ID', async () => {
            //ARRANGE
            const findByIdStub = sinon.stub(Container, 'findById').resolves(null);

            const req = {
                params: {id: 'nonexistent-id'}
            };

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            };



            //ACT
            await containerController.getContainerById(req, res);

            //ASSERT
            expect(findByIdStub.calledOnceWith('nonexistent-id')).to.be.true;
            expect(res.status.calledOnceWith(404)).to.be.true;
            expect(res.json.calledOnceWithMatch({message: 'Container not found'})).to.be.true;

        });

        it('should return 500 when DB communication fails', async ()=> {
            //ARRANGE
            const findStub = sinon.stub(Container, 'find').rejects(new Error('DB failure'));

            const req = {query: {}};
            
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            };

            //ACT
            await containerController.getContainers(req, res);

            //ASSERT
            expect(res.status.calledOnceWith(500)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.firstCall.args[0]).to.have.property('message', 'DB failure');
        });
    });
});