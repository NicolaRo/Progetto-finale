//Import Chai and Sinon as test tools
const {expect} = require ('chai');
const sinon = require ('sinon');

//Import model and contoller
const Container = require ('../../models/Containers');
const containerController = require ('../../controllers/containerController');

describe('createContainer', () => {
    describe('createContainer', ()=> {
        afterEach(() => {
            sinon.restore();
        });
        it('should create a container and return 201', async ()=> {
            //ARRANGE
            const req = {
                body:{
                    type: "Sealed",
                    availability: {},
                    status: "Container ready to use"
                }
            };

            const fakeContainer = {
                _id: "123fakeContainerId",
                type: "Sealed",
                availability: {},
                status: "Container ready to use"
            };

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            };

            const createStub = sinon.stub(Container, 'create').resolves(fakeContainer);

            //ACT
            await containerController.createContainer(req, res);

            //ASSERT
            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.calledWithMatch({
                type: "Sealed",
                availability: {},
                status: "Container ready to use"
            })).to.be.true;
            expect(createStub.calledOnceWith(req.body)).to.be.true;

            createStub.restore();
        });

        it('should return 400 if required data is missing', async () => {
            const req ={
                body: {
                    //type is missing
                    availability: {},
                    status: "Container ready to use"
                }
            };

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            };

            const createStub = sinon.stub(Container, 'create');

            //ACT
            await containerController.createContainer(req, res);


            //ASSERT
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({message: "Container details are missing"})).to.be.true;
            expect(createStub.notCalled).to.be.true;  
        });

        it('should return 500 if the DB fails', async () => {
            //ARRANGE
            const req = {
                body: {
                    type: "Sealed",
                    availability: {},
                    status: "Container ready to use"
                }
            };

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            };

            const createStub = sinon.stub(Container, 'create').rejects(new Error("DB failure"));

            //ACT
            await containerController.createContainer(req, res);

            //ASSERT
            expect(res.json.calledWithMatch({message: "DB failure"})).to.be.true;
            expect(res.json.calledWithMatch({message: "DB failure"})).to.be.true;
        });
    });
});