const parseIntFromBody = ({ operationType, x, y }) => {
  let intx;
  let inty;

  //checking for potential operands in operationType
  if (operationType.length > 14) {
    const myArray = operationType.split(" ");
    const probableNum = myArray.filter((item) => {
      if (parseInt(item) && typeof parseInt(item) === "number") {
        return item;
      }
    });
    if (probableNum.length < 2 && !x && !y) {
      return { intx: 0, inty: 0, error: "missing data types" };
    } else if (probableNum.length < 2) {
      intx = parseInt(x);
      inty = parseInt(y);
    } else {
      intx = parseInt(probableNum[0]);
      inty = parseInt(probableNum[1]);
    }
  } else {
    intx = parseInt(x);
    inty = parseInt(y);
  }

  return { intx, inty, error: "" };
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
    console.log("this is ", operator);
    return { operator: " ", error: "invalid operation type" };
  }

  return { operator, error: "" };
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
  const { intx, inty, error } = parseIntFromBody({ x, y, operationType });

  if (error) {
    return res.status(400).json({ message: error });
  }

  //getting operator
  const { operator, error: operatorError } = getOperator({ operationType });

  if (error) {
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
