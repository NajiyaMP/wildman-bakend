const jwt = require('jsonwebtoken');

const userjwt = (req, res, next) => {
    console.log("Inside JWT Middleware!!!");
   
    // Log all the headers to debug
    console.log("Headers: ", req.headers);

    const authHeader = req.headers["authorization"];
   
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        console.log("Token: ", token);

        try {
            const jwtResponse = jwt.verify(token, process.env.JWT_USERSECRET);
            console.log("Decoded JWT Payload: ", jwtResponse);

            // Assign the entire payload instead of just userId
            req.payload = jwtResponse;

            // Optionally, you can check if userId exists in payload
            if (!req.payload.userId) {
                return res.status(401).json({ message: "User ID not found in token" });
            }

            next();
        } catch (err) {
            console.error("JWT Verification Error: ", err); // Log the error for debugging
            return res.status(401).json({ message: "Authorization failed... Please login!" });
        }
    } else {
        return res.status(406).json({ message: "Authorization header is missing or improperly formatted" });
    }
};

module.exports = userjwt;


// const jwt = require('jsonwebtoken');

// const userjwt = (req, res, next) => {
//    console.log("Inside JWT Middleware!!!");
   
//    // Log all the headers to debug
//    console.log("Headers: ", req.headers);

//    const authHeader = req.headers["authorization"];
   
//    if (authHeader && authHeader.startsWith("Bearer ")) {
//        const token = authHeader.split(" ")[1];
//        console.log(token);

//        try {
//            const jwtResponse = jwt.verify(token, process.env.JWT_USERSECRET);
//            console.log(jwtResponse);
//            req.payload = jwtResponse.userId;
//            next();
//        } catch (err) {
//            return res.status(401).json("Authorization failed... Please login!!!");
//        }
//    } else {
//        return res.status(406).json("Authorization header is missing or improperly formatted");
//    }
// };

// module.exports = userjwt;