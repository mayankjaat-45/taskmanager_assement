import Project from "../models/Project.js";

export const createProject = async (req, res) => {
  try {
    const { name, description, members = [] } = req.body;

    if (!name) {
      return res.status(400).json({ msg: "Project name required" });
    }

    const project = await Project.create({
      name,
      description,
      members: [
        ...new Set([...members, req.user.id]), // ✅ include creator + avoid duplicates
      ],
      createdBy: req.user.id,
    });

    const newProject = await Project.findById(project._id)
      .populate("members", "name email")
      .populate("createdBy", "name");

    res.status(201).json(newProject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      members: req.user.id,
    })
      .populate("members", "name email")
      .populate("createdBy", "name");

    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSingleProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "members",
      "name email",
    );

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    //cheking the access
    const isMember = project.members.some(
      (m) => m._id.toString() === req.user.id,
    );

    if (!isMember) {
      return res.status(403).json({ msg: "Access denied" });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addMembers = async (req, res) => {
  try {
    const { members } = req.body;

    if (!members || !Array.isArray(members)) {
      return res.status(400).json({ msg: "Members must be an array" });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Only owner can add members" });
    }

    project.members = [
      ...new Set([...project.members.map(String), ...members]),
    ];

    await project.save();

    const updated = await Project.findById(project._id)
      .populate("members", "name email")
      .populate("createdBy", "name");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
