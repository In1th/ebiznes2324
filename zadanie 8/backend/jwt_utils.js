import jwt from "jsonwebtoken";

export const generateToken = (payload) => {
    const secret = process.env.SECRET;
    const options = {
        expiresIn: '1h'
    }

    return jwt.sign(payload, secret, options);
}