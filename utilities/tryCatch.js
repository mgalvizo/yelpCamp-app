// Function that takes another function as a parameter and returns an async function with
// express's parameters, inside the async function the controller will be executed in the
// try block with the passed async parameters and if somethings goes wrong the error will
// be caught in the catch block.

module.exports = controller => async (req, res, next) => {
    try {
        await controller(req, res);
    } catch (error) {
        return next(error);
    }
};
