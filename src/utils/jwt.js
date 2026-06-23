import jwt from 'jsonwebtoken';

export function generateAccessToken(user) {

    return jwt.sign(
        {
            sub: user.id,
            companyId: user.companyId,
            role: user.role,
            name: user.name
        },
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn: process.env.JWT_ACCESS_EXPIRATION,
        }
    );
}

export function generateRefreshToken(user) {

    return jwt.sign(
        {
            sub: user.id,
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: process.env.JWT_REFRESH_EXPIRATION,
        }
    );
}

export function verifyAccessToken(token) {

    return jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET
    );

}

export function verifyRefreshToken(token) {

    return jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET
    );

}