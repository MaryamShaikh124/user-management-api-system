
let users = [
  {
    id: 1,
    name: "Ali Khan",
    email: "ali@example.com",
    role: "Developer"
  },
  {
    id: 2,
    name: "Sara Ahmed",
    email: "sara@example.com",
    role: "Designer"
  },
  {
    id: 3,
    name: "Ahmed Raza",
    email: "ahmed@example.com",
    role: "Student"
  }
];

let nextId = 4;

// GET: Get all users
exports.getUsers = (req, res) => {
  res.json(users);
};

// GET: Get one user by ID
exports.getUserById = (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  res.json(user);
};

// POST: Add a new user
exports.createUser = (req, res) => {
  const { name, email, role } = req.body;

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof email !== "string" ||
    !email.trim() ||
    typeof role !== "string" ||
    !role.trim()
  ) {
    return res.status(400).json({
      message: "Name, email, and role are required"
    });
  }

  const newUser = {
    id: nextId++,
    name: name.trim(),
    email: email.trim(),
    role: role.trim()
  };

  users.push(newUser);

  res.status(201).json(newUser);
};

// PUT: Update an existing user
exports.updateUser = (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  const { name, email, role } = req.body;

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof email !== "string" ||
    !email.trim() ||
    typeof role !== "string" ||
    !role.trim()
  ) {
    return res.status(400).json({
      message: "Name, email, and role are required"
    });
  }

  user.name = name.trim();
  user.email = email.trim();
  user.role = role.trim();

  res.json(user);
};

// DELETE: Delete a user
exports.deleteUser = (req, res) => {
  const id = Number(req.params.id);
  const userExists = users.some((u) => u.id === id);

  if (!userExists) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  users = users.filter((u) => u.id !== id);

  res.json({
    message: "User deleted successfully"
  });
};
