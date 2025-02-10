

const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Παίρνουμε το token μετά το "Bearer"

  if (!token) {
    return res.status(401).json({ message: "Authorization denied: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Διασφαλίζουμε ότι το JWT_SECRET είναι σωστά φορτωμένο

    req.user = { _id: decoded.userId }; // Αποθηκεύουμε το userId ως _id για να ταιριάζει με τον controller
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({
      message: err.name === "TokenExpiredError" ? "Token has expired" : "Invalid token",
    });
  }
};

module.exports = verifyToken;
