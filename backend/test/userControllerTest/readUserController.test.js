//Import chai & sinon as test tool
const {expect} = require ('chai');
const sinon = require ('sinon');

//Import model and controller
const userController = require('../../controllers/userController');
const User = require('../../models/Users');

//Describe the test pourpose
describe ('UserController', async () => {
    
    //Describe the group of tests
    describe('getUsers', () => {
        afterEach(() => {
            sinon.restore();
        });

        it('should return 200 and an array of users when DB call succeeds', async() => {

            //ARRANGE
            const fakeUser = [{id: 1, name: "Mario", email: 'mario@gmail.com'}];
            const findStub = sinon.stub(User, 'find').resolves(fakeUser);

            const req = {query: {} };

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            };

            //ACT
            await userController.getUsers(req, res);

            //ASSERT
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.json.calledOnceWithMatch(fakeUser)).to.be.true;
        });

        it('should return 500 when DB comunication break down', async() => {

            //ARRANGE
            const findStub = sinon.stub(User, 'find').rejects(new Error('DB failure'));

            const req =  {
                query: {}
            };

            const res =  {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            };

            //ACT
            await userController.getUsers(req, res);

            //ASSERT
            expect(findStub.calledOnce).to.be.true;
            expect(res.status.calledOnceWith(500)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.firstCall.args[0]).to.have.property('message', 'DB failure');
        });
    });
    
    describe('getUSerById', () => {
        afterEach(() => {
            sinon.restore();
        });
        it('should return 200 and the user when ID exists', async () => {
            
            //ARRANGE
            const fakeUser = {
                _id: '123',
                name: 'Mario',
                email: 'mario@email.com'
            };

            const findByIdStub = sinon.stub(User, 'findById').resolves(fakeUser);

            const req = {
                params: {id: '123'}
            };

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            };

            //ACT
            await userController.getUserById(req, res);

            //ASSERT
            expect(findByIdStub.calledOnceWith('123')).to.be.true;
            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.json.calledOnceWithMatch(fakeUser)).to.be.true;
        });

        it('should return 404 failing to find User searched with the ID', async () => {
            
            //ARRANGE
            const findByIdStub = sinon.stub(User, 'findById').resolves(null);

            const req = {
                params: {id: 'nonexistent-id'}
            };

            const res =  {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            };

            //ACT
            await userController.getUserById(req, res);

            //ASSERT
            expect(findByIdStub.calledOnceWith('nonexistent-id')).to.be.true;
            expect(res.status.calledOnceWith(404)).to.be.true;
            expect(res.json.calledOnceWithMatch({message: "User not found"})).to.be.true;
        });

        it('should return status code 500 and an error message when the comunication with the DB breaks down', async () => {

            //ARRANGE
            const findStub = sinon.stub(User, 'findById').rejects(new Error('DB failure'));
            const req = {
                params: {id: '123'}
            };

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            };

            //ACT
            await userController.getUserById(req, res);

            //ASSERT
            expect(findStub.calledOnceWith('123')).to.be.true;
            expect(res.status.calledOnceWith(500)).to.be.true;
            expect(res.json.calledOnceWithMatch({message: 'DB failure'})).to.be.true;
        });
    });
});