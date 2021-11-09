const Express = require("express");
const router = Express.Router();
let validateJWT = require("../middleware/validate-jwt");
const { LogModel } = require("../models");


// log Create

router.post("/log", validateJWT, async (req, res) => {
  const { description, definition, result, owner_id } = req.body.log;
  const { id } = req.user;
  const logEntry = {
    description,
    definition,
    result,
    owner_id: id,
  };
  try {
    const newLog = await LogModel.create(logEntry);
    res.status(200).json(newLog);
  } catch (err) {
    res.status(500).json({ error: err });
  }
  // LogModel.create(logEntry);
});

router.get("/", async (req, res) => {
  try {
    const entries = await LogModel.findAll();
    res.status(200).json(entries);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.get("/mine", validateJWT, async (req, res) => {
  const { id } = req.user;
  try {
    const userLog = await LogModel.findAll({
      where: {
        owner: id,
      },
    });
    res.status(200).json(userLog);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.put("update/:id", validateJWT, async (req, res) => {
  const { description, definition, result, owner_id } = req.body.log;
  const logId = req.params.entryId;
  const userId = req.user.id;

  const query = {
    where: {
      id: logId,
      owner: userId,
    },
  };

  const updatedLog = {
    description: description,
    definition: definition,
    result: result,
    owner_id: owner_id,
  };

  try {
    const update = await LogModel.update(updatedLog, query);
    res.status(200).json(update);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.delete("/delete/:id", validateJWT, async (req, res) => {
  const ownerId = req.user.id;
  const logId = req.params.id;

  try {
    const query = {
      where: {
        id: logId,
        owner: ownerId,
      },
    };

    await LogModel.destroy(query);
    res.status(200).json({ message: "Workout Log Entry Deleted" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

module.exports = router;