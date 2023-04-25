// Auth views

exports.renderLogInView = (
  res,
  statusCode,
  oldInputs,
  errorMessage,
  validationErrors
) => {
  return res.status(statusCode).render("login/login", {
    pageTitle: "Login",
    path: "/login",
    oldInput: {
      email: oldInputs.email,
      password: oldInputs.password,
    },
    errorMessage: errorMessage,
    validationErrors: validationErrors,
  });
};

exports.renderSignUpView = (
  res,
  status,
  oldInputs,
  errorMessage,
  validationErrors
) => {
  return res.status(status).render("login/register", {
    pageTitle: "Signup",
    path: "/register",
    oldInput: {
      firstName: oldInputs.firstName,
      lastName: oldInputs.lastName,
      email: oldInputs.email,
      age: oldInputs.age,
      phoneCharacteristic: oldInputs.phoneCharacteristic,
      phone: oldInputs.phone,
      country: oldInputs.country,
      password: oldInputs.password,
      passwordConfirm: oldInputs.passwordConfirm,
    },
    errorMessage: errorMessage,
    validationErrors: validationErrors,
  });
};

exports.renderNewPasswordView = (
  res,
  statusCode,
  userId,
  passwordToken,
  oldInputs,
  errorMessage,
  validationErrors
) => {
  return res.status(statusCode).render("login/new-password", {
    path: "/login",
    pageTitle: "New Password",
    userId: userId,
    passwordToken: passwordToken,
    oldInputs: oldInputs,
    errorMessage: errorMessage,
    validationErrors: validationErrors,
  });
};

// Add / Edit Product
exports.renderAddOrEditProductView = (
  res,
  statusCode,
  product,
  oldInputs,
  errorMessage,
  validationErrors,
  editMode
) => {
  return res.status(statusCode).render("admin/edit-product", {
    path: "/admin/products",
    pageTitle: "Add Product",
    product: product,
    oldInputs: {
      name: oldInputs.name,
      rating: oldInputs.rating,
      hours: oldInputs.hours,
      minutes: oldInputs.minutes,
      year: oldInputs.year,
      strService: oldInputs.strService,
      price: oldInputs.price,
    },
    errorMessage: errorMessage,
    validationErrors,
    editMode: editMode,
  });
};
