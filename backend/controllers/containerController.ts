import { Request, Response } from "express";
import Container from "../models/Containers";
import { JwtPayload } from "jsonwebtoken";

// CRUD

interface ContainerInput {
    type?: "Sealed" | "Non-Sealed" | "Freezer-Container";
    status?: "Container ready to use" | "Container busy" | "Container ready for collection";
}

interface AppError extends Error {
    status?: number;
}

// 1. Create Container
const createContainer = async (req: Request<{}, {}, ContainerInput>, res: Response) => {
    try {
        const { type, status } = req.body;

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
        return res.status(500).json({ message: (error as Error).message });
    }
};

// 2.1. Read Containers information
const getContainers = async (req: Request, res: Response) => {
    try {
        const containers = await Container.find();
        return res.status(200).json(containers);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
};

// 2.2. Read one specific container
const getContainerById = async (req: Request, res: Response) => {
    try {
        const container = await Container.findById(req.params.id);
        if (!container) {
            return res.status(404).json({ message: "Container not found" });
        }
        return res.status(200).json(container);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
};

// 3. Update a container
const updateContainer = async (req: Request<{ id: string }, {}, ContainerInput>, res: Response) => {
    try {

        const container = await Container.findById(req.params.id);

        if (!container)
            return res.status(404).json({ message: "Container not found" });

        const { status } = req.body;

        // Se lo status non viene fornito, la richiesta è incompleta:
        // rispondiamo esplicitamente invece di lasciare la richiesta senza risposta
        if (!status) {
            return res.status(400).json({ message: "Container status is required" });
        }

        const allowedStatuses = [
            "Container ready to use",
            "Container busy",
            "Container ready for collection",
        ];

        if (!allowedStatuses.includes(status)) {
            const err: AppError = new Error("Invalid Container status");
            err.status = 422; // Unprocessable Entity
            throw err;
        }

        // req.user può essere string o JwtPayload: solo il secondo ha .role
        const userRole = typeof req.user === "string" ? undefined : (req.user as JwtPayload)?.role;

        // If the role is User:
        if (userRole === "User") {
            // Only allow for 1 status change to "Container ready for collection"
            if (
                container.status !== "Container busy" ||
                status !== "Container ready for collection"
            )
                return res.status(403).json({ message: "..." });
        }
        // If the role is "Producer"
        else if (userRole === "Producer") {

            // Prevent status change to "Container ready for collection"
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

    } catch (error) {
        const err = error as AppError;
        return res.status(err.status || 500).json({ message: err.message });
    }
};

// 4. Delete a container
const deleteContainer = async (req: Request, res: Response) => {
    try {
        const container = await Container.findByIdAndDelete(req.params.id);
        if (!container)
            return res.status(404).json({ message: "Container not found" });
        return res.status(200).json({ message: "Container deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
};

export {
    createContainer,
    getContainers,
    getContainerById,
    updateContainer,
    deleteContainer,
};
module.exports = {
    createContainer,
    getContainers,
    getContainerById,
    updateContainer,
    deleteContainer,
};