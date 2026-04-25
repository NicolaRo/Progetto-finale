//Import Chai, sinon as test tool
const {expect} = require ('chai');
const sinon = require ('sinon');

//Import model and controller
const userController = require('../../controllers/userController');
const User = require ('../../models/Users');

describe('Update User Controller', () => {
    
    afterEach(()=> {
        sinon.restore();
    });

    it('should update a registered user and return 200', async () => {
        const req = {
            params: { id: '123fakeid'},
            body: {
                name: "Mario",
                surname: "Rossi",
                email: "mario@example.com",
                password: "AzAGROrtoFelice",
                role: "Producer"
            }
        };

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        const fakeUpdatedUser = {
            _id: '123fakeid',
            name: 'Mario',
            surname: 'Rossi',
            email: "mario@example.com",
            password: "AzAGROrtoFelice",
            role: "Producer"
        };

        const updateStub = sinon.stub(User, 'findByIdAndUpdate').resolves(fakeUpdatedUser);

        //ACT
        await userController.updateUser(req, res);

        //ASSERT
        expect(updateStub.calledOnce).to.be.true;
        expect(updateStub.firstCall.args[0]).to.equal('123fakeid');
        expect(updateStub.firstCall.args[1]).to.deep.equal(req.body);
        expect(updateStub.firstCall.args[2]).to.include({new: true});
        expect(updateStub.firstCall.args[2]).to.include({runValidators: true});

        updateStub.restore();
    });

    it('should return 404 if the user ID does not exist', async () => {
        
        //ARRANGE
        const req = {
            params: {id: 'nonexistent-id'},
            body: {
                name: 'Mario',
                surname: 'Rossi',
                email: "mario@example.com",
                password: "AzAGROrtoFelice",
                role: "Producer"
            }
        };

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        const updateStub = sinon.stub(User, 'findByIdAndUpdate').resolves(null);

        //ACT
        await userController.updateUser (req, res);

        //ASSERT
        expect(updateStub.calledOnce).to.be.true;
        expect(updateStub.firstCall.args[0]).to.equal('nonexistent-id');
        expect(updateStub.firstCall.args[1]).to.deep.equal(req.body);
        expect(updateStub.firstCall.args[2]).to.include({new: true, runValidators: true});
        expect(res.status.calledOnceWith(404)).to.be.true;
        expect(res.json.calledOnceWithMatch({message: "User not found"}));

        updateStub.restore();
    });
    it('should retutn 500 if the DB fails', async () => {
        //ARRANGE
        const req = {
            params: {id: '123fakeid'},
            body: {
                name: 'Mario',
                surname: 'Rossi',
                email: "mario@example.com",
                password: "AzAGROrtoFelice",
                role: "Producer"
            }
        };

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        const updateStub = sinon.stub(User, 'findByIdAndUpdate').rejects(new Error('DB failure'));

        //ACT
        await userController.updateUser(req, res);

        //ASSERT
        expect(updateStub.calledOnce).to.be.true;
        expect(res.status.calledOnceWith(500)).to.be.true;
        expect(res.json.calledOnceWithMatch({message: 'DB failure'})).to.be.true;

        updateStub.restore();
    });
})