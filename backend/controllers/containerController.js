//CRUD

//Import the model
const Container = require("../models/Containers");

//1. Create Container
const createContainer = async (req, res) => {
  try {
    const { type, availability, state } = req.body;

    if (!type || !availability || !state) {
      return res.status(400).json({ message: "Container details are missing" });
    }
    const container = await Container.create({
      type,
      availability,
      state,
    });
    return res.status(201).json(container);
  } catch (error) {
    console.error("Container create Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

//2.1. Read Containers information
const getContainers = async (req, res) => {
  try {
    const containers = await Container.find();
    return res.status(200).json(containers);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//2.2. Read one specific container
const getContainerById = async (req, res) => {
  try {
    const container = await Container.findById(req.params.id);
    if (!container) {
      return res.status(404).json({ message: "Container not found" });
    }
    return res.status(200).json(container);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//3. Update a container

const updateContainer = async (req, res) => {
  try {
    const container = await Container.findById(req.params.id);

    if (!container)
      return res.status(404).json({ message: "Container not found" });

    const { state } = req.body;
    const allowedStatuses = [
      "Container ready to use",
      "Container busy",
      "Container ready for collection",
    ];
    if (state) {
      if (!allowedStatuses.includes(state)) {
        const err = new Error("Invalid Container state");
        err.state = 422; //Unprocessable Entity
        throw err;
      }
      //To know which is the current state
      const currentIndex = allowedStatuses.indexOf(container.state);

      //To set a new state to migrate to
      const newIndex = allowedStatuses.indexOf(state);

      //If the role is User:
      if (req.user.role === "User") {
        //Only allow for 1 state change to "Container ready for collection"
        if (
          container.state !== "Container busy" ||
          state !== "Container ready for collection"
        )
          return res.status(403).json({ message: "..." });
      }
      //If the role is "Producer"
      else if (req.user.role === "Producer") {
        //Prevent state change to "Container ready for collection"
        const validProducerTransition =
          (container.state === "Container ready to use" &&
            state === "Container busy") ||
          (container.state === "Container ready for collection" &&
            state === "Container ready to use");

        if (!validProducerTransition)
          return res
            .status(403)
            .json({ message: "Invalid transition for Producer" });
      }
      container.state = state;

      await container.save();
      return res.status(200).json(container);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//4. Delete a container
const deleteContainer = async (req, res) => {
  try {
    const container = await Container.findByIdAndDelete(req.params.id);
    if (!container)
      return res.status(404).json({ message: "Container not found" });
    return res.status(200).json({ message: "Container deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createContainer,
  getContainers,
  getContainerById,
  updateContainer,
  deleteContainer,
};
