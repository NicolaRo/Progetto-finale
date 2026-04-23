//Import Chai, sinon as test tool
const {expect} = require ('chai');
const sinon = require ('sinon');

//Import Model and Controller
const userController = require ('../../controllers/userController');
const User = require ('../../models/Users');

//Describe the test pourpose
describe('userController', ()=> {

    //set a variable to restore stubs
    let deleteStub;
    //after each test it delete the stubs
    afterEach (() => {
        if(deleteStub) deleteStub.restore();
    });

    describe('createUSer', () => {
        it('should create an user and return 201', async () => {

            //ARRANGE

            //Define HTTP req. outloook
            const req = {
                body: {
                    name: "Mario",
                    surname: "Rossi",
                    email: "mario@example.com",
                    password: "AzAGROrtoFelice",
                    role: "Producer"
                }
            };

            //DB returns Fake user when createUser is executed
            const fakeUser =  {
                name: "Mario",
                surname: "Rossi",
                email: "mario@example.com",
                password: "hashedPassword",
                role: "Producer",
                _id: "123fakeid"
                };

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            };

            const createStub = sinon.stub(User, 'create').resolves(fakeUser);

            //ACT
            await userController.createUser(req, res);

            //ASSERT
            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.calledWithMatch({
                name: "Mario",
                surname: "Rossi",
                email: "mario@example.com",
                password: "hashedPassword"
            })).to.be.true;
            expect(createStub.calledOnceWith(req.body)).to.be.true;
        });

        it('should return 400 if required data is missing', async () => {
            
            //ARRANGE
            const req = {
                body: {
                    name: "Mario",
                    surname: "Rossi"
                }
            };

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            };

            const createStub = sinon.stub(User, 'create');

            //ACT
            await userController.createUser(req, res);

            //ASSERT
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({message: "User details are missing"})).to.be.true;
            expect(createStub.notCalled).to.be.true;

            createStub.restore();
        });
        it('should return 500 if the DB fails', async() => {

            //ARRANGE
            const req =  {
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

            const createStub = sinon.stub(User, 'create').rejects(new Error("DB Failure"));

            //ACT
            await userController.createUser(req, res);

            //ASSERT
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({message: "DB Failure"})).to.be.true;

            createStub.restore();
        });
    });
});