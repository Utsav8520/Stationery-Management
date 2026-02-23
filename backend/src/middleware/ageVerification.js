const MINIMUM_AGE = parseInt(process.env.MINIMUM_AGE) || 21;

const calculateAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

const ageVerificationMiddleware = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    if (!req.user.birthdate) {
        return res.status(403).json({ message: 'Age verification required: Please update your profile with your birthdate' });
    }

    const age = calculateAge(req.user.birthdate);

    if (age < MINIMUM_AGE) {
        return res.status(403).json({
            message: `Age restriction: You must be at least ${MINIMUM_AGE} years old to place an order.`,
            currentAge: age
        });
    }

    next();
};

module.exports = {
    ageVerificationMiddleware,
    calculateAge
};
