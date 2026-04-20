const jwt = require("jsonwebtoken");

function protect(req, res, next) {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({ message: "No autorizado, no hay token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secreto");
        req.user = { id: decoded.id };
        next();
    } catch (err) {
        return res.status(401).json({ message: "No autorizado, token no válido" });
    }
}

module.exports = { protect };
