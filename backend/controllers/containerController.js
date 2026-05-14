//CRUD

//Import the model
const Container = require("../models/Containers");

//1. Create Container
const createContainer = async (req, res) => {
  try {
    const { type,  status } = req.body;

    if (!type || !status) {
      return res.status(400).json({ message: "Container details are missing" });
    }
    const container = await Container.create({
      type,
      status,
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

    const { status } = req.body;
    const allowedStatuses = [
      "Container ready to use",
      "Container busy",
      "Container ready for collection",
    ];
    if (status) {
      if (!allowedStatuses.includes(status)) {
        const err = new Error("Invalid Container status");
        err.status = 422; //Unprocessable Entity
        throw err;
      }
      //To know which is the current status
      const currentIndex = allowedStatuses.indexOf(container.status);

      //To set a new status to migrate to
      const newIndex = allowedStatuses.indexOf(status);

      //If the role is User:
      if (req.user.role === "User") {
        //Only allow for 1 status change to "Container ready for collection"
        if (
          container.status !== "Container busy" ||
          status !== "Container ready for collection"
        )
          return res.status(403).json({ message: "..." });
      }
      //If the role is "Producer"
      else if (req.user.role === "Producer") {
        //Prevent status change to "Container ready for collection"
        const validProducerTransition =
          (container.status === "Container ready to use" &&
            status === "Container busy") ||
          (container.status === "Container ready for collection" &&
            status === "Container ready to use");

        if (!validProducerTransition)
          return res
            .status(403)
            .json({ message: "Invalid transition for Producer" });
      }
      container.status = status;

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
