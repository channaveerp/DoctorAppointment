export const jwtTokengenerator = (user, message, statusCode, res) => {
  const token = user.generateJsonToken();
  const cookiesName = user.role === 'Admin' ? 'adminToken' : 'patientToken';
  res
    .status(statusCode)
    .cookie(cookiesName, token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
      ),
    })
    .json({
      success: true,
      token,
      user,
      message,
    });
};
