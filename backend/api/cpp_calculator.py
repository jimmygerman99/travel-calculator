# cpp_calculator.py

def calculate_cpp(price: float, points: float) -> float:
    """
    Calculate Cents Per Point (CPP).

    :param price: The price of the flight or hotel in dollars.
    :param points: The number of points needed for redemption.
    :return: CPP value.
    """
    if points == 0:
        raise ValueError("Points cannot be zero.")
    cpp = (price / points) * 100  # Cents per point ratio
    return cpp


def calculate_cpp_withTax(price: float, points: float, tax: float) -> float:
    """
    Calculate Cents Per Point (CPP).

    :param price: The price of the flight or hotel in dollars.
    :param points: The number of points needed for redemption.
    :return: CPP value.
    """
    tax *= 100
    points += tax
    if points == 0:
        raise ValueError("Points cannot be zero.")
    cpp = (price / points) * 100  # Cents per point ratio
    return cpp
