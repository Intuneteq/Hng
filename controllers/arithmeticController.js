const parseIntFromBody = ({ operationType, x, y }) => {
  let intx;
  let inty;

  const probableIntArray = operationType.split(" ");
  const probableInt = probableIntArray.filter((item) => {
    //if we have integers
    if (parseInt(item) && typeof parseInt(item) === "number") {
      return item;
    }
  });
  //no in integers operation type and x, y were not provided so it's a bad request
  if (probableInt.length < 2 && !x || !y) {
    return { intx: 0, inty: 0, parseIntError: "missing data types" };
    //x and y were provided and < 2 integers in operation type
  } else if (probableInt.length < 2) {
    intx = parseInt(x);
    inty = parseInt(y);
    //> 2 integers in operation type and x, y may or may not have been provided
  } else {
    intx = parseInt(probableInt[0]);
    inty = parseInt(probableInt[1])
  }

  return { intx, inty, parseIntError: "" };
};

const getOperator = ({ operationType }) => {
  const hasproductOperator =
    operationType.includes("multip") || operationType.includes("product");
  const hasAdditionOperator =
    operationType.includes("add") || operationType.includes("sum");
  const hasSubtractionOperator =
    operationType.includes("subtract") ||
    operationType.includes("minus") ||
    operationType.includes("take away") ||
    operationType.includes("remove");

  let operator; //instantiating the variable to handle whatever operation type sent in

  if (hasproductOperator) {
    operator = "multiplication";
  } else if (hasAdditionOperator) {
    operator = "addition";
  } else if (hasSubtractionOperator) {
    operator = "subtraction";
  } else {
    console.log('error');
    return { operatorError: "invalid operation type" };
  }
  return { operator, operatorError: "" };
};

const handleArithmetic = (req, res) => {
  const { x, y, operation_type } = req.body;

  if (!operation_type) {
    return res
      .status(400)
      .json({ message: "Kindly fill all required fields." }); //if req body is not complete
  }

  const operationType = operation_type.toLowerCase(); //setting incoming string to lowercase

  //parse integers from the request body
  const { intx, inty, parseIntError } = parseIntFromBody({ x, y, operationType });

  if (parseIntError) {
    return res.status(400).json({ message: parseIntError });
  }

  //getting operator
  const { operator, operatorError } = getOperator({ operationType });

  if (operatorError) {
    console.log('error error');
    return res.status(400).json({ message: operatorError });
  }

  //we have our operation_type handling as operator
  let result; //declaring a variable to hold result of computation
  if (operator === "multiplication") {
    result = intx * inty;
  } else if (operator === "addition") {
    result = intx + inty;
  } else {
    result = intx - inty;
  }
  return res.status(200).json({
    slackUsername: "Intuneteq",
    operation_type: operator,
    result: result,
  });
};

module.exports = { handleArithmetic };
