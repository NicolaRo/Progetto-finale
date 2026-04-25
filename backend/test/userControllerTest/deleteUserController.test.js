//Import chai and sinon as test tools
const {expect} = require('chai');
const sinon = require ('sinon');

//Import model and controller
const userController = require('../../controllers/userController');
const User = require ('../../models/Users');

describe('User Controller - deleteUser', () => {
    
    let deleteStub;
    afterEach( () => {
        if (deleteStub) deleteStub.restore();
    });

    it('should delete an existing User', async () => {

        //ARRANGE
        const req = {
            params: {id: 'fakeUserId123'}
        };

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        const deleteUser = {
            _id: 'fakeUserId123',
            name: 'Mario',
            surname: 'Rossi',
            email: "mario@example.com",
            password: "AzAGROrtoFelice",
            role: "Producer"
        };

        deleteStub = sinon.stub(User, 'findByIdAndDelete').resolves(deleteUser);

        //ACT
        await userController.deleteUser(req, res);

        //ASSERT
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
        expect(deleteStub.calledOnceWith(req.params.id)).to.be.true;
    });

    it('should return 404 if user id not found', async () => {
        
        //ARRANGE
        const req = {
            params: {
                id: 'nonexistingId123'
            }
        };

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        deleteStub = sinon.stub(User, 'findByIdAndDelete').resolves(null);

        //ACT
        await userController.deleteUser(req, res);

        //ASSERT
        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
        expect(deleteStub.calledOnceWith(req.params.id)).to.be.true;
    });

    it('should return 500 if DB fails', async () => {

        //ARRANGE
        const req = {
            params:{
                id: 'anyId'
            }
        };

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        deleteStub = sinon.stub(User, 'findByIdAndDelete').rejects(new Error('DB Error'));

        //ACT
        await userController.deleteUser(req, res);

        //ASSERT
        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
    });
});