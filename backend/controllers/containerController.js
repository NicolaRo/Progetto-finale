//CRUD

//Import the model
const Container = require ('../models/Containers');

//1. Create Container
const createContainer = async (req, res) => {
    try {
        const {type, availability, state} = req.body;

        if(!type || !availability || !state) {
            return res.status(400).json ({message: "Container details are missing"});
        } 
        const container = await Container.create ({
            type,
            availability,
            state
        });
        return res.status(201).json(container);
    } catch (error) {
        console.error('Container create Error:', error);
        return res.status(500).json({message: error.message});
    }
};

//2.1. Read Containers information
const getContainers = async (req, res) => {
    try {
        const containers = await Container.find();
        return res.status(200).json(containers);
    } catch (error) {
        return res.status(500).json ({message: error.message});
    }
};

//2.2. Read one specific container
const getContainerById = async (req, res) => {
    try {
        const container = await Container.findById(req.params.id);
        if(!container) {
            return res.status(404).json({message: "Container not found"});
        }
        return res.status(200).json(container);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

//3. Update a container

const updateContainer = async (req, res) => {
    try {
        const container = await Container.findByIdAndUpdate (
            req.params.id,
            req.body,
            {new: true}
        );
        if(!container)
            return res.status(404).json({message:"Container not found"});
        return res.status(200).json(container);
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
};

//4. Delete a container
const deleteContainer = async (req, res) => {
    try{
        const container = await Container.findByIdAndDelete (
            req.params.id
        );
        if(!container)
            return res.status(404).json ({message: "Container not found"});
        return res.status(200).json({message: "Container deleted successfully"});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

module.exports = {
    createContainer,
    getContainers,
    getContainerById,
    updateContainer,
    deleteContainer
};